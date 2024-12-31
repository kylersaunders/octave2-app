import 'server-only';

import { updateSpotifyToken } from './auth';

import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: 'https://social-pug-45284.upstash.io',
  token: 'AbDkAAIjcDE0NDJiNTNiYzkxZmU0MWQ1OWMwNzZlYTg4MDRiNjNjNHAxMA',
});

export type AuthObj = {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
};

export const getHostUrl = () => {
  const host = process.env.VERCEL_URL || 'localhost:3000';
  const protocol = process.env.VERCEL_URL ? 'https' : 'http';
  return `${protocol}://${host}`;
};

export const encodeAuth = (auth: AuthObj) => {
  return { auth };
};

export const decodeAuth = (auth: AuthObj) => {
  return auth;
};

export const getCachedToken = async ({ userId }: { userId: string }) => {
  if (userId === undefined || userId === null) {
    return { accessToken: null };
  }

  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  let expiresAt: number | null = null;

  const authObj: AuthObj | null = await redis.hget(userId, 'auth');
  if (authObj !== null && authObj !== undefined) {
    ({ accessToken, refreshToken, expiresAt } = decodeAuth(authObj));

    if (!expiresAt) {
      console.log('no expiresAt');
      return { accessToken };
    }

    if (expiresAt <= new Date().getTime()) {
      if (!refreshToken) {
        console.log('expired, no refresh token');
        return { accessToken };
      }
      const newAccessToken = await updateSpotifyToken({ refreshToken, userId });
      console.log('expired, newAccessToken');
      return { accessToken: newAccessToken };
    }

    console.log('not expired');
    return { accessToken };
  }

  console.log('nothing set yet');
  return { accessToken };
};
