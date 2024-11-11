'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TrackPlus, removeTrack, selectPlaylistTracks, selectTitle, setTitle } from '@/lib/features/builder/builderSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import { builderColumns } from './components/builder-columns';
import { set } from 'lodash';

const PlaylistTitle = () => {
  const dispatch = useAppDispatch();
  const playlistName = useAppSelector(selectTitle);

  console.log('TitleAndImage rendered');
  return (
    <div className='flex items-center justify-between'>
      <div>
        <Input
          value={playlistName}
          onChange={(e) => dispatch(setTitle(e.target.value))}
          placeholder='Enter a playlist name'
          className='text-xl font-bold outline-none border-none bg-transparent w-full focus:border-none'
        />
      </div>
    </div>
  );
};

export default function PlaylistBuilder() {
  console.log('PlaylistBuilder rendered');
  const tracks = useAppSelector(selectPlaylistTracks);

  if (tracks.length) {
    return <DataTable data={tracks} columns={builderColumns} CustomSection={PlaylistTitle} />;
  }

  return <>Add some songs to start building</>;
}
