import { getSpotifyProfile } from './profile';
import { getSpotifyAccessToken } from './tokens';

export const getUserPlaylists = async () => {
  const accessToken = await getSpotifyAccessToken();
  const profile = await getSpotifyProfile();
  const response = await fetch(`https://api.spotify.com/v1/users/${profile.id}/playlists`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  if (!response.ok) {
    throw new Error('playlists_failed');
  }
  return await response.json();
};
