'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from './data-table-column-header';
import { RecommendationsData } from '@/types/tracks';
import { ButtonAddToPlaylist, ButtonAddToSeeds } from './row-button';
import { TrackPlus } from '@/lib/features/playlist/playlistSlice';

export function millisecondsToMMSS(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
}

export const summarizeArtistsMaxN = (artists: { name: string }[], n: number) => {
  const names = artists.map((artist) => artist.name);
  return names.slice(0, n).join(', ') + (names.length > n ? '...' : '');
};

export const columns: ColumnDef<RecommendationsData | TrackPlus>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' className='translate-y-[2px]' />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Track Id' />,
  //   cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'preview_url',
    header: ({ column }) => <div>{''}</div>,
    cell: ({ row }) => {
      return (
        <audio controls>
          <source src={row.getValue('preview_url')} type='audio/mpeg' />
          Your browser does not support the audio element.
        </audio>
      );
    },
  },
  {
    id: 'addToSeeds',
    cell: ({ row }) => <ButtonAddToSeeds row={row} />,
  },
  {
    id: 'addToPlaylist',
    cell: ({ row }) => <ButtonAddToPlaylist row={row} />,
  },
  {
    accessorKey: 'duration_ms',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Duration' />,
    cell: ({ row }) => <span>{millisecondsToMMSS(row.getValue('duration_ms'))}</span>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>{row.getValue('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'tempo',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tempo' />,
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{row.getValue('tempo')}</span>
        </div>
      );
    },
  },

  {
    accessorKey: 'artists',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Artist' />,
    cell: ({ row }) => {
      const artists: { name: string }[] = row.getValue('artists');
      const names = summarizeArtistsMaxN(artists, 3);

      return (
        <div className='flex w-[100px] items-center'>
          <span>{names}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'album',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Album' />,
    cell: ({ row }) => {
      const album: { name: string } = row.getValue('album');

      return (
        <div className='flex items-center'>
          <span>{album.name}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'popularity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Popularity' />,
    cell: ({ row }) => <span>{row.getValue('popularity')}</span>,
  },
];
