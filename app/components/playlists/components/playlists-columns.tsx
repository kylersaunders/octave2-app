'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '../../../../components/data-table/components/data-table-column-header';
import { RecommendationsData } from '@/types/tracks';
// import { ButtonAddToPlaylist, ButtonAddToSeeds } from './row-button';
import { TrackPlus } from '@/lib/features/builder/builderSlice';

export function millisecondsToMMSS(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
}

export const summarizeArtistsMaxN = (artists: { name: string }[], n: number) => {
  const names = artists.map((artist) => artist.name);
  return names.slice(0, n).join(', ') + (names.length > n ? '...' : '');
};

export const playlistColumns: ColumnDef<RecommendationsData | TrackPlus>[] = [
  // columns are based on the UsersPlaylists type
  {
    accessorKey: 'imageUrl',
    // header: ({ column }) => <DataTableColumnHeader column={column} title='Images' />,
    cell: ({ row }) => <img className='w-[80px]' src={row.getValue('imageUrl')} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('name')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'owner',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Owner' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('owner')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('description')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'public',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Public' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('public') === true ? 'Y' : ''}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'collaborative',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Collaborative' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('collaborative') === true ? 'Y' : ''}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'tracksTotal',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tracks' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('tracksTotal')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
];
