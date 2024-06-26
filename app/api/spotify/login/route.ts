export const dynamic = 'force-dynamic'; // defaults to auto

import { generateRandomUserState } from '@/lib/utils';
import { kv } from '@vercel/kv';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();
  console.log('login - clerk user: ', userId);
  if (!userId) {
    return new Response('Login Unauthorized', { status: 401 });
  }
  const userState = generateRandomUserState(16);
  kv.set(userId + '_state', userState);

  const params = new URLSearchParams();
  params.append('response_type', 'code');

  params.append('state', userState);

  const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  params.append('scope', scope);

  if (process.env.SPOTIFY_CLIENT_ID === undefined) {
    return new Response('Login - Spotify Client ID not defined', { status: 500 });
  }
  params.append('client_id', process.env.SPOTIFY_CLIENT_ID);

  if (process.env.SPOTIFY_REDIRECT_URI === undefined) {
    return new Response('Login - Spotify Redirect URI not defined', { status: 500 });
  }
  params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);

  redirect('https://accounts.spotify.com/authorize?' + params.toString());
}
