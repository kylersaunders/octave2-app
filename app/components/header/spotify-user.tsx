'use client';
import { useContext } from 'react';
import { SpotifyContext } from '../spotify-provider';

export default function SpotifyUser() {
  const spotifyUser = useContext(SpotifyContext);
  console.log('spotifyUser', spotifyUser);
  return (
    <div>
      <h1>Spotify User</h1>
    </div>
  );
}
