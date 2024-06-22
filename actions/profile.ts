'use server';

import { redirect } from 'next/navigation';
import { getSpotifyAccessToken } from './spotify/tokens';

export const getSpotifyProfile = async () => {
  const { accessToken, expiresAt } = await getSpotifyAccessToken();
  if (!accessToken || expiresAt <= new Date().getTime().toString()) {
    redirect('/api/spotify/login');
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
