import 'server-only';

export const getSpotifyProfile = async ({ accessToken }: { accessToken: string }) => {
  console.log('GET /profile', 'SPOTIFY AC: ', accessToken.slice(-5));
  console.log('AC: ', accessToken);
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  if (!response.ok) {
    throw new Error('profile_failed');
  }
  return response.json();
};
