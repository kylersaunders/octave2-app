'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '../../../../components/data-table/components/data-table-column-header';
import { RecommendationsData } from '@/types/tracks';
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

export const builderColumns: ColumnDef<RecommendationsData | TrackPlus>[] = [
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
      // only show the first 100 chars of the ablum name
      const albumName = album.name.length > 100 ? album.name.slice(0, 100) + '...' : album.name;

      return (
        <div className='flex w-[200px] items-center'>
          <span>{albumName}</span>
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
