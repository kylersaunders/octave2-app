import { addTracks, clearTracks, selectSearchTerm, selectTracks, setSearchTerm } from '@/lib/features/tracks/tracksSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useCallback, useEffect, useState } from 'react';
import { DataTable } from '../../recommendation-table/data-table';
import { Button } from '@/components/ui/button';
import { addSeed } from '@/lib/features/seeds/seedsSlice';
import { TrackPlus } from '@/lib/features/counter/counterSlice';
import { get } from 'http';
import { searchTrackByName } from '@/actions/tracks';
import { debounce } from 'lodash';

export default function SearchTracks() {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  // const [inputValue, setInputValue] = useState('');

  const debouncedSearch = debounce(async (trackName: string) => {
    const data = await searchTrackByName(trackName);
    dispatch(addTracks(data));
  }, 500);

  // useEffect(() => {
  //   if (inputValue) {
  //     debouncedSearch(inputValue);
  //   }
  //   return () => debouncedSearch.cancel(); // Clean up
  // }, [inputValue, debouncedSearch]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setSearchTerm(e.target.value));
    debouncedSearch(e.target.value);
  }

  //   function handleAddSeed(track: TrackPlus) {
  //     dispatch(addSeed(track));
  //     dispatch(clearTracks());
  //   }

  return (
    <>
      <input type='text' id='seeds' name='seeds' value={searchTerm} placeholder='search by track name' onChange={handleInputChange} />
      {/* {tracks.length > 0 &&
        tracks.map((track: TrackPlus, ind: number) => (
          <div key={ind} className='grid grid-cols-[3fr_1fr_3fr_2fr]'>
            <audio controls src={track.preview_url}></audio>
            <Button onClick={() => handleAddSeed(track)}>Add Seed</Button>
            <span>{track.name}</span>
            <span>{track.artists.join(',')}</span>
          </div>
        ))} */}
    </>
  );
}
