'use server';

import { RedirectType, redirect } from 'next/navigation';
import { getSpotifyProfile } from './profile';
import { getSpotifyAccessToken } from './spotify/tokens';

export const getUserPlaylists = async () => {
  const { accessToken, expiresAt } = await getSpotifyAccessToken();
  if (!accessToken || expiresAt <= new Date().getTime().toString()) {
    const domain = process.env.VERCEL_ENV === 'production' ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://' + process.env.HOSTNAME;
    console.log('REDIRECTING...', domain);
    redirect(domain + '/api/spotify/login', RedirectType.replace);
  }

  const profile = await getSpotifyProfile();
  console.log('GET /playlists', 'SPOTIFY: ', profile?.id, profile?.display_name, profile?.email, '--- AC: ', accessToken?.slice(-5));
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
  const { accessToken, expiresAt } = await getSpotifyAccessToken();
  if (!accessToken || expiresAt <= new Date().getTime().toString()) {
    redirect('/api/spotify/login');
  }

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
  const { accessToken, expiresAt } = await getSpotifyAccessToken();
  if (!accessToken || expiresAt <= new Date().getTime().toString()) {
    redirect('/api/spotify/login');
  }
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
