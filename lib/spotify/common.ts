import 'server-only';

import { AudioFeatures } from '@/types/tracks';

export const getFeatures = async ({ trackIds, accessToken }: { trackIds: string[]; accessToken: string }): Promise<AudioFeatures[]> => {
  // turn the list into a comma-separated string
  const url = `https://api.spotify.com/v1/audio-features/?ids=${trackIds.join(',')}`;
  const response = await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  if (!response.ok) {
    throw new Error(`Error getting features: ${response.statusText}`);
  }
  const data = await response.json();
  return data.audio_features;
};
