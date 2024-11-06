import { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { encodeAuth } from '@/lib/auth/auth';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest, response?: any) {
  const { userId } = auth();
  if (userId === undefined || userId === null) {
    return new Response('Callback Unauthorized', { status: 401 });
  }
  const code = request?.nextUrl.searchParams.get('code');
  const state = request?.nextUrl.searchParams.get('state');
  const userState = await kv.get(userId + '_state');

  // validate state
  if (!state) {
    redirect('/#no-state');
  }
  if (!userState) {
    redirect('/#no-user-state');
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
    return new Response('Callback - Spotify Redirect URI not defined', { status: 500 });
  }
  tokenBody.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI || '');

  if (process.env.SPOTIFY_CLIENT_ID === undefined || process.env.SPOTIFY_CLIENT_SECRET === undefined) {
    return new Response('Callback - Spotify Client ID or Secret not defined', { status: 500 });
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
  const expiresAt = new Date().getTime() + expiresIn * 1000;

  if (!accessToken || !refreshToken || !expiresAt) {
    redirect('/#spotify-auth-failed');
  }

  kv.set(userId + '_auth', encodeAuth({ accessToken, refreshToken, expiresAt }));

  console.log('Callback - Spotify Auth Success');

  redirect('/');
}
