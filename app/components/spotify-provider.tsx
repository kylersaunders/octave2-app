'use client';
import { getSpotifyProfile } from '@/actions/profile';
import { useEffect, useState } from 'react';
import { createContext } from 'react';

export const SpotifyContext = createContext(null);

export default function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [spotifyUser, setSpotifyUser] = useState(null);

  async function fetchSpotifyUser() {
    try {
      const user = await getSpotifyProfile();
      console.log('user!', user);
      setSpotifyUser(user);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchSpotifyUser();
  }, []);

  return <SpotifyContext.Provider value={spotifyUser}>{children}</SpotifyContext.Provider>;
}
