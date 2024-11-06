'use client';

import { Card } from '@/components/ui/card';
import FiltersModal from '../filters';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { DataTable } from '@/components/data-table/data-table';
import { useDebouncedQuery } from '@/hooks/useDebounce';
import { EnhancedTrack } from '@/types/tracks';
import { useAppDispatch } from '@/lib/hooks';
import { setSelectedUrl } from '@/lib/features/recommendations/recommendationsSlice';
import { useQuery } from '@tanstack/react-query';
import { searchResultsColumns } from './components/columns';

const searchByTerm = async (searchTerm: string): Promise<EnhancedTrack[]> => {
  if (!searchTerm) return [];
  const response = await axios.get('/api/search', {
    params: {
      q: searchTerm,
    },
  });
  return response?.data || [];
};

export default function SearchTab() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  // const { isPending, isError, data, error } = useDebouncedQuery({
  //   queryKey: ['search', searchTerm],
  //   queryFn: () => searchByTerm(searchTerm),
  //   delay: 2000,
  // });
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => searchByTerm(searchTerm),
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  const playRowUrl = useCallback(
    async (row: any) => {
      dispatch(setSelectedUrl(row.id));
    },
    [dispatch]
  );

  return (
    <>
      <div className='grid grid-cols-7'>
        <div className='flex items-center col-span-2'>
          <FiltersModal />
        </div>
        <div className='col-span-3'>
          <Card className='m-2 p-2'>
            <div className='flex justify-center'>
              <input
                type='text'
                id='seeds'
                name='seeds'
                value={searchTerm}
                placeholder='search by artist, title, or album'
                onChange={handleInputChange}
                className='min-w-[20vw] outline-none focus:outline-none text-center'
              />
            </div>
          </Card>
        </div>
      </div>
      <DataTable data={data || []} columns={searchResultsColumns} isLoading={isPending}></DataTable>
    </>
  );
}
