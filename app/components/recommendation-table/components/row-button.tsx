'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { addTrack, selectStatus, selectRecs } from '@/lib/features/counter/playlistSlice';

import { addSeed, selectSeeds, selectSeedsStatus } from '@/lib/features/seeds/seedsSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Counter.module.css';
import { TrackPlus } from '@/lib/features/counter/playlistSlice';
import { Open } from '@/types/utils';
import { SEEDS_MAX_PHRASE } from '@/lib/constants';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function ButtonAddToSeeds<TData>({ row }: DataTableRowActionsProps<TData>) {
  const track = row.original as TrackPlus;
  const dispatch = useAppDispatch();
  const seeds = useAppSelector(selectSeeds);

  function handleAddToSeeds() {
    console.log('+seed', track.id);

    const temp = new Set(seeds.map((seed) => seed.id));

    if (temp.has(track.id)) return;
    dispatch(addSeed(row.original as TrackPlus));
  }

  if (new Set(seeds.map((x) => x.id)).has(track.id)) {
    return <Button disabled={true}>{`Used as seed`}</Button>;
  }
  if (seeds.length >= 5) {
    return <Button disabled={true}>{`Seeds limit reached`}</Button>;
  }

  return <Button onClick={handleAddToSeeds}>{`Use as seed`}</Button>;
}

export function ButtonAddToPlaylist<TData>({ row }: DataTableRowActionsProps<TData>) {
  const track = row.original as TrackPlus;
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectRecs);

  function handleAddToPlaylist() {
    console.log('+track', track.id);

    const temp = new Set(tracks.map((track) => track.id));

    if (temp.has(track.id)) return;
    dispatch(addTrack(row.original as TrackPlus));
  }

  if (new Set(tracks.map((x) => x.id)).has(track.id)) {
    return <Button disabled={true}>{`Added to playlist`}</Button>;
  }

  return <Button onClick={handleAddToPlaylist}>{`Add to playlist`}</Button>;
}
