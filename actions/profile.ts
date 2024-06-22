'use server';

import { RedirectType, redirect } from 'next/navigation';
import { getSpotifyAccessToken } from './spotify/tokens';

export const getSpotifyProfile = async () => {
  const { accessToken, expiresAt } = await getSpotifyAccessToken();
  if (!accessToken || expiresAt <= new Date().getTime().toString()) {
    const domain = process.env.VERCEL_ENV === 'production' ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://' + process.env.HOSTNAME;

    redirect(domain + '/api/spotify/login', RedirectType.replace);
  }

  console.log('GET /profile', 'SPOTIFY AC: ', accessToken.slice(-5));
  console.log('AC: ', accessToken);
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  if (!response.ok) {
    throw new Error('profile_failed');
  }
  return response.json();
};
