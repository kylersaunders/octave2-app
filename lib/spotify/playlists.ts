import 'server-only';

import { getSpotifyProfile } from './profile';

export const getUserPlaylists = async ({ accessToken }: { accessToken: string }) => {
  const profile = await getSpotifyProfile({ accessToken });
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

export const deletePlaylist = async ({ playlistId, accessToken }: { playlistId: string; accessToken: string }) => {
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

export const getPlaylistTracks = async ({ playlistId, accessToken }: { playlistId: string; accessToken: string }) => {
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

export const createPlaylist = async ({ playlistName, accessToken }: { playlistName: string; accessToken: string }) => {
  console.log(
    'body',
    JSON.stringify({
      name: playlistName,
    })
  );
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: playlistName,
    }),
  });
  if (!response.ok) {
    // console.log(response);
    throw new Error('playlist_create_failed');
  }

  const data = await response.json();
  console.log('data', data.id);
  return data.id;
};

export const addTracksToPlaylist = async ({ playlistId, trackIdList, accessToken }: { playlistId: string; trackIdList: string[]; accessToken: string }) => {
  console.log('trackIdList', playlistId, trackIdList);
  // add trackIds to the playlist
  const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: trackIdList.map((trackId) => 'spotify:track:' + trackId),
    }),
  });
  if (!addTracksResponse.ok) {
    throw new Error('playlist_add_tracks_failed');
  }
  return await addTracksResponse.json();
};
