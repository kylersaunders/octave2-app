'use client';

import { useEffect, useState } from 'react';

import { addTracksToPlaylistAsync, selectStatus, selectTitle, selectRecs, removeTrack } from '@/lib/features/counter/counterSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Counter.module.css';
import { TrackPlus } from '@/lib/features/counter/counterSlice';
import { createPlaylist } from '@/actions/tracks';
import build from 'next/dist/build';
import { Button } from '@/components/ui/button';

export default function PlaylistPage() {
  console.log('PlaylistPage rendered');
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectRecs);
  const status = useAppSelector(selectStatus);
  const playlistName = useAppSelector(selectTitle);

  function handleRemoveFromPlaylist(trackId: string) {
    dispatch(removeTrack(trackId));
  }

  async function handleCreatePlaylist() {
    const playlistId = await createPlaylist({ playlistName });
    dispatch(addTracksToPlaylistAsync({ playlistId, trackIdList: tracks.map((x: TrackPlus) => x.id) }));
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (tracks.length) {
    return (
      <div className='space-y-4 m-4'>
        <div>
          {tracks.map((track: TrackPlus, ind: number) => (
            <div key={track.id} className='grid grid-cols-[1fr_5fr]'>
              {/* <img src={track.album.images?.[0]?.url || '#'} alt={track.name} /> */}
              <div key={'x' + ind} className='flex flex-row items-center m-1'>
                <Button variant='outline' size='sm' onClick={() => handleRemoveFromPlaylist(track.id)}>
                  x
                </Button>
              </div>
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
