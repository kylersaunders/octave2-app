'use server';

import { kv } from '@vercel/kv';
import { generateRandomUserState } from '@/lib/utils';
import { redirect } from 'next/navigation';

export const loginWithSpotify: () => void = async () => {
  const params = new URLSearchParams();
  params.append('response_type', 'code');

  const state = generateRandomUserState(16);
  params.append('state', state);

  const scope = 'user-read-private user-read-email';
  params.append('scope', scope);

  if (process.env.SPOTIFY_CLIENT_ID === undefined) {
    throw new Error('client_id_not_defined');
  }
  params.append('client_id', process.env.SPOTIFY_CLIENT_ID);

  if (process.env.SPOTIFY_REDIRECT_URI === undefined) {
    throw new Error('redirect_uri_not_defined');
  }
  params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);

  return redirect('https://accounts.spotify.com/authorize?' + params.toString());
};

export const getSpotifyAccessToken = async () => {
  const expiresAt: string | null = await kv.get('userId_expires_at');

  // if expires_at > current time UTC , call /api/spotify/refresh
  if (expiresAt || new Date().getTime() <= new Date().getTime()) {
    const refresh_token: string | null = await kv.get('userId_refresh_token');
    // get new access_token, refresh_token, expires_in
    if (refresh_token === null) {
      loginWithSpotify();
    } else {
      await updateSpotifyTokens(refresh_token);
    }
  }
  const access_token: string | null = await kv.get('userId_access_token');
  if (access_token === null) {
    throw new Error('access_token_not_found');
  }
  return access_token;
};

// to use a refresh token to update all tokens/expiries
export const updateSpotifyTokens: (refresh_token: string) => Promise<void> = async (refresh_token) => {
  const refreshTokenBody = new URLSearchParams();
  refreshTokenBody.append('grant_type', 'refresh_token');
  refreshTokenBody.append('refresh_token', refresh_token);

  if (process.env.SPOTIFY_CLIENT_ID === undefined || process.env.SPOTIFY_CLIENT_SECRET === undefined) {
    throw new Error('client_id_secret_not_defined');
  }
  const authPhrase = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');

  // obtain tokens
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: refreshTokenBody,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + authPhrase,
    },
  });
  if (!response.ok) {
    throw new Error('auth_failed');
  }
  const tokens = await response.json();
  kv.set('userId_access_token', tokens.access_token);
  // kv.set('userId_refresh_token', tokens.refresh_token);
  const expiresAt = new Date().getTime() + tokens.expires_in * 1000;
  kv.set('userId_expires_at', expiresAt);
};

export const setSpotifyAccessToken = async (code: string) => {
  const authTokenBody = new URLSearchParams();
  authTokenBody.append('grant_type', 'authorization_code');
  authTokenBody.append('code', code);

  if (process.env.SPOTIFY_REDIRECT_URI === undefined) {
    throw new Error('redirect_uri_not_defined');
  }
  authTokenBody.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);

  if (process.env.SPOTIFY_CLIENT_ID === undefined || process.env.SPOTIFY_CLIENT_SECRET === undefined) {
    throw new Error('client_id_secret_not_defined');
  }
  const authPhrase = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');

  // obtain tokens
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: authTokenBody,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + authPhrase,
    },
  });
  if (!response.ok) {
    throw new Error('auth_failed');
  }
  const tokens = await response.json();
  kv.set('userId_access_token', tokens.access_token);
  kv.set('userId_refresh_token', tokens.refresh_token);
  const expiresAt = new Date().getTime() + tokens.expires_in * 1000;
  kv.set('userId_expires_at', expiresAt);
};
