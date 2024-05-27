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

import { addSeed } from '@/lib/features/seeds/seedsSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Open } from '@/types/utils';
import { useState } from 'react';
import { deletePlaylist } from '@/actions/playlists';
import { removePlaylist } from '@/lib/features/playlists/playlistsSlice';

interface PlaylistsRowActionsProps<TData> {
  row: Row<TData>;
  cancel?: () => void;
}

function DeleteConfirmationActions({ row, cancel }: PlaylistsRowActionsProps<any>) {
  const dispatch = useAppDispatch();
  async function handleDelete() {
    // TODO: error handling
    await deletePlaylist(row.original.id);
    // TODO: debug this && figure out if server actions are working
    dispatch(removePlaylist(row.original.id));
    if (cancel) cancel();
  }

  return (
    <div className='flex space-x-2'>
      <Button variant='ghost' onClick={cancel}>
        Cancel
      </Button>
      <Button variant='destructive' onClick={handleDelete}>
        Confirm
      </Button>
    </div>
  );
}

function Delete({ row }: PlaylistsRowActionsProps<any>) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  return (
    <>
      {deleteConfirmation ? (
        <DeleteConfirmationActions row={row} cancel={() => setDeleteConfirmation(false)} />
      ) : (
        <Button variant='ghost' onClick={() => setDeleteConfirmation(true)}>
          Delete Playlist
        </Button>
      )}
    </>
  );
}

function Edit() {
  return <Button variant='ghost'>Edit</Button>;
}

export function PlaylistsRowActions<TData>({ row }: PlaylistsRowActionsProps<TData>) {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectPlaylistTracks);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='data-[state=open]:bg-muted'>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[160px]'>
        <Edit />
        <Delete row={row} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
