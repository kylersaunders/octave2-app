'use client';

import { selectRecStatus, selectRecTracks } from '@/lib/features/recommendations/byNameSlice';
import { columns } from './recs-columns';
import { DataTable } from '../../../../components/data-table/data-table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export default function ResultsTable() {
  console.log('ResultsTable rendered');
  const tracks = useAppSelector(selectRecTracks);
  const status = useAppSelector(selectRecStatus);
  console.log('tracks', tracks);

  if (status !== 'idle') return <div>Loading...</div>;

  // @ts-ignore
  if (tracks.length) return <DataTable data={tracks} columns={columns} />;
}
