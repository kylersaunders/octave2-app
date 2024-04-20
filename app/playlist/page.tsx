'use client';

import { useEffect, useState } from 'react';

import { addTracksToPlaylistAsync, selectStatus, selectTitle, selectTracks } from '@/lib/features/counter/counterSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Counter.module.css';
import { TrackPlus } from '@/lib/features/counter/counterSlice';
import { createPlaylist } from '@/actions/tracks';
import build from 'next/dist/build';
import { Button } from '@/components/ui/button';

export default function PlaylistPage() {
  console.log('PlaylistPage rendered');
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectTracks);
  const status = useAppSelector(selectStatus);
  const playlistName = useAppSelector(selectTitle);

  async function handleCreatePlaylist() {
    const playlistId = await createPlaylist({ playlistName });
    dispatch(addTracksToPlaylistAsync({ playlistId, trackIdList: tracks.map((x: TrackPlus) => x.id) }));
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (tracks.length) {
    return (
      <div className='max-h-[40vh] overflow-auto space-y-4'>
        <div>
          {tracks.map((track: TrackPlus, ind: number) => (
            <div key={track.id}>
              {/* <img src={track.album.images[0].url} alt={track.name} /> */}
              <h3>{track.name}</h3>
              {/* <p>{track.artists.map((artist) => artist.name).join(', ')}</p> */}
            </div>
          ))}
        </div>
        <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
      </div>
    );
  }
  return null;
}
