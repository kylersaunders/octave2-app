export const dynamic = 'force-dynamic'; // defaults to auto

import { generateRandomUserState } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { kv } from '@vercel/kv';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function GET(request?: NextRequest, response?: any) {
  const { userId } = auth();
  const userState = generateRandomUserState(16);
  kv.set(userId + '_state', userState);

  const params = new URLSearchParams();
  params.append('response_type', 'code');

  params.append('state', userState);

  const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  params.append('scope', scope);

  if (process.env.SPOTIFY_CLIENT_ID === undefined) {
    throw new Error('client_id_not_defined');
  }
  params.append('client_id', process.env.SPOTIFY_CLIENT_ID);

  if (process.env.SPOTIFY_REDIRECT_URI === undefined) {
    throw new Error('redirect_uri_not_defined');
  }
  params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);

  redirect('https://accounts.spotify.com/authorize?' + params.toString());
}