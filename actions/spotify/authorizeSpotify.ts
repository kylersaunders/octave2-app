import 'server-only';

import { generateRandomUserState } from '@/lib/utils';
import { redirect } from 'next/navigation';

const userState = generateRandomUserState(16);

export const getUserState = async () => userState;

export const authorizeSpotify = async () => {
  'use server';
  const params = new URLSearchParams();
  params.append('response_type', 'code');

  params.append('state', userState);

  const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  params.append('scope', scope);

  if (process.env.SPOTIFY_CLIENT_ID === undefined) {
    throw new Error('Login - Spotify Client ID not defined');
  }
  params.append('client_id', process.env.SPOTIFY_CLIENT_ID);

  if (process.env.SPOTIFY_REDIRECT_URI === undefined) {
    throw new Error('Login - Spotify Redirect URI not defined');
  }
  params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);

  redirect('https://accounts.spotify.com/authorize?' + params.toString());
};
