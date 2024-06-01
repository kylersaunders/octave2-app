'use server';

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

export const deletePlaylist = async (playlistId: string) => {
  const accessToken = await getSpotifyAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  if (!response.ok) {
    throw new Error('delete_playlist_failed');
  }
};

export const getPlaylistTracks = async (playlistId: string) => {
  const accessToken = await getSpotifyAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  if (!response.ok) {
    throw new Error('playlist_tracks_failed');
  }
  return await response.json();
};
