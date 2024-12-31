import 'server-only';

import { getCachedToken } from '@/lib/spotify/getCachedToken';
import { auth } from '@clerk/nextjs/server';

export const checkConnectedWithSpotify = async () => {
  'use server';
  const { userId } = await auth();
  console.log('checked user', userId);

  if (!userId) {
    console.error('Unauthorized user');
    return false;
  }

  const { accessToken } = await getCachedToken({ userId });

  if (!accessToken) {
    console.error(`User's Spotify not yet connected`);
    return false;
  }

  return true;
};
