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
import {
  addTrack,
  // decrement,
  // increment,
  // incrementAsync,
  // incrementByAmount,
  // incrementIfOdd,
  // selectCount,
  selectStatus,
  selectTracks,
} from '@/lib/features/counter/counterSlice';

import { addSeed } from '@/lib/features/seeds/seedsSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Counter.module.css';
import { TrackPlus } from '@/lib/features/counter/counterSlice';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectTracks);

  function handleAddToPlaylist() {
    // console.log('Add to playlist:', row.original);
    dispatch(addTrack(row.original as TrackPlus));
  }

  function handleAddToSeeds() {
    dispatch(addSeed(row.original as TrackPlus));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleAddToPlaylist}>Add to playlist</DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddToSeeds}>Add to recommendation seeds</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
