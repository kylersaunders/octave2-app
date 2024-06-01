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

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Open } from '@/types/utils';
import { useState } from 'react';
import { deletePlaylist } from '@/actions/playlists';
import { removePlaylist } from '@/lib/features/playlists/playlistsSlice';

interface PlaylistsRowActionsProps<TData> {
  id: string;
  cancel?: (e: any) => void;
}

function DeleteConfirmationActions({ id, cancel }: PlaylistsRowActionsProps<any>) {
  const dispatch = useAppDispatch();
  async function handleDelete(e: any) {
    e.preventDefault();
    // TODO: error handling
    await deletePlaylist(id);
    // TODO: debug this && figure out if server actions are working
    dispatch(removePlaylist(id));
    if (cancel) cancel(e);
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

function Delete({ id }: PlaylistsRowActionsProps<any>) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  return (
    <>
      {deleteConfirmation ? (
        <DeleteConfirmationActions
          id={id}
          cancel={(e: any) => {
            e.preventDefault();
            setDeleteConfirmation(false);
          }}
        />
      ) : (
        <Button
          variant='ghost'
          onClick={(e: any) => {
            e.preventDefault();
            setDeleteConfirmation(true);
          }}
        >
          Delete Playlist
        </Button>
      )}
    </>
  );
}

function Edit() {
  return <Button variant='ghost'>Edit</Button>;
}

export function PlaylistsRowActions<TData>({ id }: PlaylistsRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='data-[state=open]:bg-muted'>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[160px]'>
        <Edit />
        <Delete id={id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
