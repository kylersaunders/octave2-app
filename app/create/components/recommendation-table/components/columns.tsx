'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// import { labels, priorities, statuses } from '../data/data';
// import { Task } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { RecommendationsData } from '@/types/tracks';
import { ButtonAddToPlaylist, ButtonAddToSeeds } from './row-button';

// {
//     "id": "4nb0zF72NRNfOXRBpzx6E4",
//     "name": "The Lights That Glisten Forever In The Sky",
//     "album": "The Bleached Moon Had A Magical Light",
//     "artists": "The Safety Word",
//     "duration": 147341,
//     "preview": "https://p.scdn.co/mp3-preview/f6c1645cb9fba2726ac7410175e8c0e8f693d334?cid=d349f2b9978d429f967f7d13e2622a80",
//     "popularity": 15
// }

function millisecondsToMMSS(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
}

export const columns: ColumnDef<RecommendationsData>[] = [
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
    accessorKey: 'preview',
    header: ({ column }) => <div>{''}</div>,
    cell: ({ row }) => {
      return (
        <audio controls>
          <source src={row.getValue('preview')} type='audio/mpeg' />
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
    accessorKey: 'duration',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Duration' />,
    cell: ({ row }) => <span>{millisecondsToMMSS(row.getValue('duration'))}</span>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
    cell: ({ row }) => {
      // const label = labels.find((label: any) => label.value === row.original.label);

      return (
        <div className='flex space-x-2'>
          {/* {label && <Badge variant='outline'>{label.label}</Badge>} */}
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
      // const status = statuses.find((status: any) => status.value === row.getValue('artists'));

      // if (!status) {
      //   return null;
      // }

      return (
        <div className='flex w-[100px] items-center'>
          {/* {status.icon && <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />} */}
          <span>{row.getValue('artists')}</span>
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
      // const priority = priorities.find((priority: any) => priority.value === row.getValue('album'));

      // if (!priority) {
      //   return null;
      // }

      return (
        <div className='flex items-center'>
          {/* {priority.icon && <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />} */}
          <span>{row.getValue('album')}</span>
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
