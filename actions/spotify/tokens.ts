'use server';

import { kv } from '@vercel/kv';
import { auth, currentUser } from '@clerk/nextjs/server';
import { convertExpiresAt } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { loginWithSpotify } from './login';

export const getSpotifyAccessToken = async () => {
  const session = auth();
  const { userId } = session;
  const user = await currentUser();
  if (userId === undefined || userId === null) {
    throw new Error('getAC - user_id_not_defined');
  }

  let access_token: string | null = (await kv.get(userId + '_access_token')) || null;
  const expiresAt: string | null = (await kv.get(userId + '_expires_at')) || new Date().getTime().toString();

  // if expires_at > current time UTC , call /api/spotify/refresh
  if (expiresAt <= new Date().getTime().toString()) {
    const refresh_token: string | null = await kv.get(userId + '_refresh_token');
    if (refresh_token === null || refresh_token === undefined) {
      loginWithSpotify();
    } else {
      access_token = await updateSpotifyTokens(refresh_token);
    }
  }

  if (access_token === null) {
    throw new Error('after no expiry - access_token_not_found');
  }

  console.log(
    '*** TOKEN RETURNED ***',
    'CLERK_ID: ',
    userId?.slice(-7),
    user?.firstName,
    user?.lastName,
    user?.emailAddresses?.[0]?.emailAddress,
    '--- SPOTIFY: ',
    convertExpiresAt(expiresAt),
    access_token?.slice(-5)
  );

  return access_token;
};

// to use a refresh token to update all tokens/expiries
export const updateSpotifyTokens: (refresh_token: string) => Promise<string> = async (refresh_token) => {
  const { userId } = auth();
  if (userId === undefined || userId === null) {
    throw new Error('updateToken - user_id_not_defined');
  }
  const refreshTokenBody = new URLSearchParams();
  refreshTokenBody.append('grant_type', 'refresh_token');
  refreshTokenBody.append('refresh_token', refresh_token);

  if (process.env.SPOTIFY_CLIENT_ID === undefined || process.env.SPOTIFY_CLIENT_SECRET === undefined) {
    throw new Error('client_id_secret_not_defined');
  }
  const authPhrase = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');

  let tokens;
  // obtain tokens
  try {
    console.log('GET /token');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: refreshTokenBody,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + authPhrase,
      },
    });

    if (!response.ok) {
      throw new Error('Response not ok - auth_failed');
    }
    tokens = await response.json();
  } catch (e) {
    console.error('Error in fetch /token', e);
    throw new Error('Error in fetch /token');
  }

  if (tokens.access_token === undefined || tokens.expires_in === undefined) {
    throw new Error('No token - auth_failed');
  }

  kv.set(userId + '_access_token', tokens.access_token);
  const expiresAt = new Date().getTime() + tokens.expires_in * 1000;
  kv.set(userId + '_expires_at', expiresAt);

  return tokens.access_token;
};
