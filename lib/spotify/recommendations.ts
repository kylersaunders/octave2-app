import 'server-only';

type Recommendations = {
  seedGenres?: string[];
  seedArtists?: string[];
  seedTracks?: string[];
  limit?: number;
  market?: string;
  targetDanceability?: number;
  minDurationMs?: number;
  targetDurationMs?: number;
  maxDurationMs?: number;
  targetEnergy?: number;
  minTempo?: number;
  targetTempo?: number;
  maxTempo?: number;
  accessToken: string;
};

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
  accessToken,
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
