'use client';

import {
  addTempoToTrack,
  selectSearchStatus,
  selectSearchTracks,
  selectSelectedUrl,
  setSelectedUrl,
} from '@/lib/features/recommendations/recommendationsSlice';
import { columns } from './recs-columns';
import { DataTable } from '../../../../components/data-table/data-table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useCallback } from 'react';
import { Status } from '@/types/common';
import { getTempo } from '@/actions/tracks';

export default function ResultsTable() {
  console.log('ResultsTable rendered');
  const tracks = useAppSelector(selectSearchTracks);
  const status = useAppSelector(selectSearchStatus);
  const dispatch = useAppDispatch();

  const playRowUrl = useCallback(
    async (row: any) => {
      // check if this id has tempo
      // if not, fetch details
      const targetTrack = tracks.find((track) => track?.id === row.id);
      if (targetTrack?.tempo === undefined) {
        const tempo = await getTempo(row.id);
        dispatch(addTempoToTrack({ id: row.id, tempo }));
      }

      dispatch(setSelectedUrl(row.id));
    },
    [dispatch, tracks]
  );

  if (status !== Status.IDLE) return <div>Loading...</div>;

  // @ts-ignore
  if (tracks.length) return <DataTable data={tracks} columns={columns} callbackOnClick={playRowUrl} />;
}
