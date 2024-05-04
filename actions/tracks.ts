'use server';

import { getSpotifyAccessToken } from './tokens';

export interface Recommendations {
  seedGenres?: string[];
  seedArtists?: string[];
  seedTracks?: string[];
  limit?: string;
  market?: string;
  targetDanceability?: string;
  targetDurationMs?: string;
  targetEnergy?: string;
  minTempo?: string;
  maxTempo?: string;
}

export const getRecommendations = async ({
  seedGenres,
  seedArtists,
  seedTracks,
  limit,
  market,
  targetDanceability,
  targetDurationMs,
  targetEnergy,
  minTempo,
  maxTempo,
}: Recommendations) => {
  const recommendationsBody = new URLSearchParams();
  if (limit) recommendationsBody.append('limit', limit.toString());
  if (market) recommendationsBody.append('market', market);
  if (seedArtists) recommendationsBody.append('seed_artists', seedArtists.join(','));
  if (seedGenres) recommendationsBody.append('seed_genres', seedGenres.join(','));
  if (seedTracks) recommendationsBody.append('seed_tracks', seedTracks.join(','));
  if (targetDanceability) recommendationsBody.append('target_danceability', targetDanceability.toString());
  if (targetDurationMs) recommendationsBody.append('target_duration_ms', targetDurationMs.toString());
  if (targetEnergy) recommendationsBody.append('target_energy', targetEnergy.toString());
  if (minTempo) recommendationsBody.append('min_tempo', minTempo.toString());
  if (maxTempo) recommendationsBody.append('max_tempo', maxTempo.toString());

  console.log('***', recommendationsBody.toString());

  const accessToken = await getSpotifyAccessToken();
  const response = await fetch('https://api.spotify.com/v1/recommendations?' + recommendationsBody.toString(), {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  if (!response.ok) {
    throw new Error('recommendations_failed');
  }
  const res = await response.json();
  if (!res.tracks.length) console.log('res', res);
  return res;
};

export const getTempo = async (trackId: string) => {
  const accessToken = await getSpotifyAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  if (!response.ok) {
    throw new Error('tempo_failed');
  }
  const data = await response.json();
  return data.tempo;
};

export const createPlaylist = async ({ playlistName }: { playlistName: string }) => {
  const accessToken = await getSpotifyAccessToken();
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

export const addTracksToPlaylist = async ({ playlistId, trackIdList }: { playlistId: string; trackIdList: string[] }) => {
  const accessToken = await getSpotifyAccessToken();
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

export const searchTrackByName = async (trackName: string) => {
  const accessToken = await getSpotifyAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/search?q=track%3D${trackName}&type=track`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  if (!response.ok) {
    throw new Error('search_tracks_failed');
  }
  const data = await response.json();
  return data.tracks.items;
};
