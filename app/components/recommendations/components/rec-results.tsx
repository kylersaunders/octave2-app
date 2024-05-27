'use client';

import { selectRecTracks } from '@/lib/features/recommendations/byNameSlice';
import { columns } from './recs-columns';
import { DataTable } from '../../../../components/data-table/data-table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export default function ResultsTable() {
  console.log('ResultsTable rendered');
  const tracks = useAppSelector(selectRecTracks);
  console.log('tracks', tracks);

  // @ts-ignore
  if (tracks.length) return <DataTable data={tracks} columns={columns} />;
}
