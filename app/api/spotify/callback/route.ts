import { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request?: NextRequest, response?: any) {
  const { userId } = auth();
  const code = request?.nextUrl.searchParams.get('code');
  const state = request?.nextUrl.searchParams.get('state');
  const userState = await kv.get(userId + '_state');

  // validate state
  if (!state || !userState) {
    redirect('/#no-state');
  }
  if (state !== userState) {
    redirect('/#bad-state');
  }

  const tokenBody = new URLSearchParams();
  tokenBody.append('grant_type', 'authorization_code');

  if (!code) {
    redirect('/#no-code');
  }
  tokenBody.append('code', code);

  if (process.env.SPOTIFY_REDIRECT_URI === undefined) {
    throw new Error('redirect_uri_not_defined');
  }
  tokenBody.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI || '');

  if (process.env.SPOTIFY_CLIENT_ID === undefined || process.env.SPOTIFY_CLIENT_SECRET === undefined) {
    throw new Error('client_id_or_secret_not_defined');
  }
  const authPhrase = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + authPhrase,
    },
    body: tokenBody,
  });
  if (!tokenRes.ok) {
    redirect('/#spotify-auth-failed');
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const expiresIn = tokenData.expires_in;

  if (!accessToken || !refreshToken || !expiresIn) {
    redirect('/#spotify-auth-failed');
  }

  const expiresAt = new Date().getTime() + expiresIn * 1000;
  kv.set(userId + '_expires_at', expiresAt);
  kv.set(userId + '_access_token', accessToken);
  kv.set(userId + '_refresh_token', refreshToken);

  redirect('/');
}
