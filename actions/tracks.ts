'use server';

import { RedirectType, redirect } from 'next/navigation';
import { getSpotifyAccessToken } from './spotify/tokens';

export interface Recommendations {
  seedGenres?: string[];
  seedArtists?: string[];
  seedTracks?: string[];
  limit?: string;
  market?: string;
  targetDanceability?: string;
  minDurationMs?: string;
  targetDurationMs?: string;
  maxDurationMs?: string;
  targetEnergy?: string;
  minTempo?: string;
  targetTempo?: string;
  maxTempo?: string;
}

export const getRecommendations = async ({
  seedGenres,
  seedArtists,
  seedTracks,
  limit,
  market,
  targetDanceability,
  minDurationMs,
  targetDurationMs,
  maxDurationMs,
  targetEnergy,
  minTempo,
  targetTempo,
  maxTempo,
}: Recommendations) => {
  const recommendationsBody = new URLSearchParams();
  if (limit) recommendationsBody.append('limit', limit.toString());
  if (market) recommendationsBody.append('market', market);
  if (seedArtists) recommendationsBody.append('seed_artists', seedArtists.join(','));
  if (seedGenres) recommendationsBody.append('seed_genres', seedGenres.join(','));
  if (seedTracks) recommendationsBody.append('seed_tracks', seedTracks.join(','));
  if (targetDanceability) recommendationsBody.append('target_danceability', targetDanceability.toString());
  if (minDurationMs) recommendationsBody.append('min_duration_ms', minDurationMs.toString());
  if (targetDurationMs) recommendationsBody.append('target_duration_ms', targetDurationMs.toString());
  if (maxDurationMs) recommendationsBody.append('max_duration_ms', maxDurationMs.toString());
  if (targetEnergy) recommendationsBody.append('target_energy', targetEnergy.toString());
  if (minTempo) recommendationsBody.append('min_tempo', minTempo.toString());
  if (targetTempo) recommendationsBody.append('target_tempo', targetTempo.toString());
  if (maxTempo) recommendationsBody.append('max_tempo', maxTempo.toString());

  console.log('***', recommendationsBody.toString());

  try {
    const { accessToken, expiresAt } = await getSpotifyAccessToken();
    if (!accessToken || expiresAt <= new Date().getTime().toString()) {
      const domain = process.env.VERCEL_ENV === 'production' ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://' + process.env.HOSTNAME;

      redirect(domain + '/api/spotify/login', RedirectType.replace);
    }
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
  } catch (e) {
    console.error('error', e);
    return { tracks: [] };
  }
};

export const getTempo = async (trackId: string) => {
  const { accessToken, expiresAt } = await getSpotifyAccessToken();
  if (!accessToken || expiresAt <= new Date().getTime().toString()) {
    const domain = process.env.VERCEL_ENV === 'production' ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://' + process.env.HOSTNAME;

    redirect(domain + '/api/spotify/login', RedirectType.replace);
  }
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
  const { accessToken, expiresAt } = await getSpotifyAccessToken();
  if (!accessToken || expiresAt <= new Date().getTime().toString()) {
    const domain = process.env.VERCEL_ENV === 'production' ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://' + process.env.HOSTNAME;

    redirect(domain + '/api/spotify/login', RedirectType.replace);
  }
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
  const { accessToken, expiresAt } = await getSpotifyAccessToken();
  if (!accessToken || expiresAt <= new Date().getTime().toString()) {
    const domain = process.env.VERCEL_ENV === 'production' ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://' + process.env.HOSTNAME;

    redirect(domain + '/api/spotify/login', RedirectType.replace);
  }
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
  try {
    const { accessToken, expiresAt } = await getSpotifyAccessToken();
    if (!accessToken || expiresAt <= new Date().getTime().toString()) {
      const domain = process.env.VERCEL_ENV === 'production' ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://' + process.env.HOSTNAME;

      redirect(domain + '/api/spotify/login', RedirectType.replace);
    }
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
  } catch (e) {
    console.error('error', e);
    return [];
  }
};

export const searchTrackByArtist = async (artistName: string) => {
  try {
    const { accessToken, expiresAt } = await getSpotifyAccessToken();
    if (!accessToken || expiresAt <= new Date().getTime().toString()) {
      const domain = process.env.VERCEL_ENV === 'production' ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://' + process.env.HOSTNAME;

      redirect(domain + '/api/spotify/login', RedirectType.replace);
    }
    const response = await fetch(`https://api.spotify.com/v1/search?q=artist%3D${artistName}&type=track`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    if (!response.ok) {
      throw new Error('search_tracks_failed');
    }
    const data = await response.json();
    return data.tracks.items;
  } catch (e) {
    console.error('error', e);
    return [];
  }
};

export const searchTrackByAlbum = async (albumName: string) => {
  try {
    const { accessToken, expiresAt } = await getSpotifyAccessToken();
    if (!accessToken || expiresAt <= new Date().getTime().toString()) {
      const domain = process.env.VERCEL_ENV === 'production' ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://' + process.env.HOSTNAME;

      redirect(domain + '/api/spotify/login', RedirectType.replace);
    }
    const response = await fetch(`https://api.spotify.com/v1/search?q=album%3D${albumName}&type=track`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    if (!response.ok) {
      throw new Error('search_tracks_failed');
    }
    const data = await response.json();
    return data.tracks.items;
  } catch (e) {
    console.error('error', e);
    return [];
  }
};
