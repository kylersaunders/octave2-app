'use client';
import { getSpotifyAccessToken } from '@/actions/tokens';

import { useEffect } from 'react';

export default function LoginWithSpotify() {
  useEffect(() => {
    const checkAuth = async () => {
      // const auth = await checkSpotifyAuth();
      // if (!auth) {
      //   window.location.href = '/api/spotify/login';
      // }
    };

    checkAuth();
  }, []);

  return <></>;
}
