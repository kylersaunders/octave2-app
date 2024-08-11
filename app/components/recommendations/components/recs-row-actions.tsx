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
import { addTrack, selectStatus, selectPlaylistTracks } from '@/lib/features/builder/builderSlice';

import { addSeed } from '@/lib/features/recommendations/recommendationsSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Counter.module.css';
import { TrackPlus } from '@/lib/features/builder/builderSlice';
import { Open } from '@/types/utils';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  children?: React.ReactNode;
  open: Open;
  setOpen: (prev: Open) => void;
  id: string;
}

export function DataTableRowActions<TData>({ row, children, open, setOpen, id }: DataTableRowActionsProps<TData>) {
  console.log('status', id, open?.[id]);
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectPlaylistTracks);

  function reset() {
    if (typeof id === 'string') {
      // @ts-ignore
      setOpen?.((prev: Open) => ({ ...prev, [id!]: false }));
    } else {
      throw new Error('id is not a string');
    }
  }

  function handleAddToPlaylist() {
    dispatch(addTrack(row.original as TrackPlus));
    reset();
  }

  function handleAddToSeeds() {
    dispatch(addSeed(row.original as TrackPlus));
    reset();
  }

  // return (
  //   <DropdownMenu
  //     // @ts-ignore
  //     open={open?.[id]}
  //     onOpenChange={() => {
  //       const { id }: { id: string } = row.original as TrackPlus;
  //       // console.log('change: ', open);
  //       // if (!open?.[id]) console.log('id not found');
  //       // @ts-ignore
  //       // if (setOpen) setOpen((prev: Open) => ({ ...prev, [id]: !prev[id] }));
  //     }}
  //   >
  //     {/* <DropdownMenuTrigger asChild>
  //       <Button variant='ghost' className='data-[state=open]:bg-muted'>
  //         {children}
  //       </Button>
  //     </DropdownMenuTrigger> */}
  //     <DropdownMenuContent align='start' className='w-[160px]'>
  //       <DropdownMenuItem onClick={handleAddToPlaylist}>Add to playlist</DropdownMenuItem>
  //       <DropdownMenuItem onClick={handleAddToSeeds}>Add to recommendation seeds</DropdownMenuItem>
  //     </DropdownMenuContent>
  //   </DropdownMenu>
  // );
  return <>{`Delete Me`}</>;
}
