import 'server-only';

import { kv } from '@vercel/kv';

export const updateSpotifyToken = async ({ refreshToken, userId }: { refreshToken: string; userId: string }) => {
  if (userId === undefined || userId === null) {
    throw new Error('updateToken - user_id_not_defined');
  }
  const refreshTokenBody = new URLSearchParams();
  refreshTokenBody.append('grant_type', 'refresh_token');
  refreshTokenBody.append('refresh_token', refreshToken);

  if (process.env.SPOTIFY_CLIENT_ID === undefined || process.env.SPOTIFY_CLIENT_SECRET === undefined) {
    throw new Error('client_id_secret_not_defined');
  }
  const authPhrase = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');

  let tokens;
  try {
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

  const expiresAt = new Date().getTime() + tokens.expires_in * 1000;
  kv.set(userId + '_auth', { accessToken: tokens.access_token, refreshToken, expiresAt: expiresAt });

  return tokens.access_token;
};
