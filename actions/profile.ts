'use server';

import { getSpotifyAccessToken } from './spotify/tokens';

export const getSpotifyProfile = async () => {
  const access_token: string = await getSpotifyAccessToken();

  console.log('GET /profile', 'SPOTIFY AC: ', access_token.slice(-5));
  console.log('AC: ', access_token);
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  if (!response.ok) {
    throw new Error('profile_failed');
  }
  return response.json();
};
