import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { encodeAuth, getHostUrl, redis } from '@/lib/spotify/getCachedToken';
import { getUserState } from '@/actions/spotify/authorizeSpotify';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest) {
  const { userId } = auth();
  console.log('Callback - Clerk user: ', userId);
  if (userId === undefined || userId === null) {
    console.error('Callback Unauthorized');
    throw new Error('Unauthorized');
  }

  const code = request?.nextUrl.searchParams.get('code');
  const state = request?.nextUrl.searchParams.get('state');
  // try {
  //   const userState = await getUserState();
  //   // validate state
  //   if (!state || !userState || state !== userState) {
  //     console.error('Invalid state');
  //     throw new Error('Invalid state');
  //   }
  // } catch (error) {
  //   console.error('Callback - KV Error', error);
  //   return NextResponse.redirect(`${getHostUrl()}/#spotify-auth-failed`);
  // }

  const tokenBody = new URLSearchParams();
  tokenBody.append('grant_type', 'authorization_code');

  if (!code) {
    console.error('No code provided');
    throw new Error('No code provided');
  }
  tokenBody.append('code', code || '');

  if (process.env.SPOTIFY_REDIRECT_URI === undefined) {
    console.error('Spotify Redirect URI not defined');
    throw new Error('Spotify Redirect URI not defined');
  }
  tokenBody.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI || '');

  if (process.env.SPOTIFY_CLIENT_ID === undefined || process.env.SPOTIFY_CLIENT_SECRET === undefined) {
    console.error('Spotify Client ID or Secret not defined');
    throw new Error('Spotify Client ID or Secret not defined');
  }

  const authPhrase = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');
  console.log('Callback - Fetching token', authPhrase, tokenBody);
  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + authPhrase,
      },
      body: tokenBody,
    });
    if (!tokenRes.ok) {
      console.error('Callback - Spotify Auth Failed');
      throw new Error('Spotify Auth Failed');
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;
    const expiresAt = new Date().getTime() + expiresIn * 1000;

    if (!accessToken || !refreshToken || !expiresAt) {
      console.error('Callback - Spotify Auth Failed');
      throw new Error('Spotify Auth Failed');
    }

    redis.hset(userId, encodeAuth({ accessToken, refreshToken, expiresAt }));

    console.log('Callback - Spotify Auth Success', accessToken, refreshToken, expiresAt);
  } catch (error) {
    console.error('Callback - Spotify Auth Error:', error);
    return NextResponse.redirect(`${getHostUrl()}/#spotify-auth-failed`);
  }

  return NextResponse.redirect(`${getHostUrl()}/#success`);
}
