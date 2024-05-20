'use client';

import { setTracks, clearTracks, selectSearchTerm, selectRecTracks, setSearchTerm } from '@/lib/features/recs/recsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { searchTrackByName } from '@/actions/tracks';
import { debounce } from 'lodash';
import { Card } from '@/components/ui/card';
import { use, useEffect } from 'react';

export default function SearchTracks() {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setSearchTerm(e.target.value));
  }

  const debouncedSearch = debounce(async (trackName: string) => {
    const data = await searchTrackByName(trackName);
    dispatch(setTracks(data));
  }, 500);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  return (
    <Card className='m-4 p-4'>
      <input
        type='text'
        id='seeds'
        name='seeds'
        value={searchTerm}
        placeholder='search by artist, track, or album'
        onChange={handleInputChange}
        className='min-w-[20vw] outline-none focus:outline-none'
      />
    </Card>
  );
}
