'use server';

import { getSpotifyAccessToken } from './tokens';

export const getSpotifyProfile = async () => {
  const access_token: string = await getSpotifyAccessToken();

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
