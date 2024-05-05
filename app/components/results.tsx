'use client';

import { selectTracks } from '@/lib/features/tracks/tracksSlice';
import { columns } from './recommendation-table/components/columns';
import { DataTable } from './recommendation-table/data-table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export default function ResultsTable() {
  console.log('ResultsTable rendered');
  const tracks = useAppSelector(selectTracks);
  console.log('tracks', tracks);

  // @ts-ignore
  if (tracks.length) return <DataTable data={tracks} columns={columns} />;
}
