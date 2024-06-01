'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TrackPlus, removeTrack, selectPlaylistTracks } from '@/lib/features/builder/builderSlice';
import { useAppSelector } from '@/lib/hooks';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { summarizeArtistsMaxN } from '../recommendations/components/recs-columns';
import { DataTable } from '@/components/data-table/data-table';
import { builderColumns } from './components/builder-columns';

export default function PlaylistBuilder() {
  const tracks = useAppSelector(selectPlaylistTracks);
  const [playlistName, setPlaylistName] = useState('');

  if (tracks.length) {
    return <DataTable data={tracks} columns={builderColumns} />;
  }

  return <>Add some songs to start building</>;
}
