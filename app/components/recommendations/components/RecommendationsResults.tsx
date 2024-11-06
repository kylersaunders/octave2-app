'use client';

import {
  addTempoToTrack,
  SearchSliceFiltersState,
  selectSearchFilters,
  selectSearchStatus,
  selectSearchTracks,
  selectSelectedUrl,
  setSelectedUrl,
} from '@/lib/features/recommendations/recommendationsSlice';
import { columns } from './recs-columns';
import { DataTable } from '../../../../components/data-table/data-table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useCallback, useMemo } from 'react';
import { Status } from '@/types/common';
import { getTempo } from '@/actions/tracks';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetRecommendationsQuery } from '@/lib/api/fetchRecommendations';
import { getQueryStringFromObject } from '@/lib/utils';

export default function RecommendationsResults() {
  console.log('ResultsTable rendered');
  const queryParams = useAppSelector(selectSearchFilters);
  // const tracks = useAppSelector(selectSearchTracks);
  const dispatch = useAppDispatch();

  const debouncedQueryParams = useDebounce(queryParams, 1000);
  const queryString = useMemo(() => getQueryStringFromObject<SearchSliceFiltersState>(debouncedQueryParams), [debouncedQueryParams]);
  const { data, error, isLoading } = useGetRecommendationsQuery(queryString);

  const playRowUrl = useCallback(
    async (row: any) => {
      // check if this id has tempo
      // if not, fetch details
      const targetTrack = data.find((track: any) => track?.id === row.id);
      if (targetTrack?.tempo === undefined) {
        const tempo = await getTempo([row.id]);
        dispatch(addTempoToTrack({ id: row.id, tempo }));
      }

      dispatch(setSelectedUrl(row.id));
    },
    [dispatch, data]
  );

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  // @ts-ignore
  if (data.length)
    return (
      <DataTable data={data} columns={columns} callbackOnClick={playRowUrl}>
        <p>Expanded</p>
      </DataTable>
    );
}
