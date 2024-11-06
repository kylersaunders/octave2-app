import { kv } from '@vercel/kv';
import { updateSpotifyToken } from '../spotify/auth';
import { redirect } from 'next/navigation';

export type AuthObj = {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
};

export const encodeAuth = (auth: AuthObj) => {
  return auth;
};

export const decodeAuth = (auth: AuthObj) => {
  return auth;
};

export const getCachedToken = async ({ userId }: { userId: string }) => {
  if (userId === undefined || userId === null) {
    throw new Error('getAC - user_id_not_defined');
  }

  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  let expiresAt: number | null = null;

  const authObj: AuthObj | null = await kv.get(userId + '_auth');
  if (authObj !== null && authObj !== undefined) {
    ({ accessToken, refreshToken, expiresAt } = decodeAuth(authObj));

    if (!expiresAt) {
      redirect('/api/spotify/login');
    }

    if (expiresAt <= new Date().getTime()) {
      if (!refreshToken) {
        redirect('/api/spotify/login');
      }
      const newAccessToken = await updateSpotifyToken({ refreshToken, userId });
      return { accessToken: newAccessToken };
    }

    return { accessToken };
  }

  redirect('/api/spotify/login');
};
