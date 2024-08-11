'use client';

import { setTracks, selectSearchTerm, setSearchTerm, setRecStatus, selectSearchTracks } from '@/lib/features/recommendations/recommendationsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { searchTrackByAlbum, searchTrackByArtist, searchTrackByName } from '@/actions/tracks';
import { debounce } from 'lodash';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { Track } from '@/types/tracks';
import { IDLE, LOADING } from '@/lib/constants';

export default function SearchTracks() {
  // TODO: don't re-search on tab back (unless it includes advanced search)
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setSearchTerm(e.target.value));
  }

  const debouncedSearch = debounce(async (trackName: string) => {
    // run searches by name, artist, and album at the same time
    const data = await Promise.all([searchTrackByName(trackName), searchTrackByArtist(trackName), searchTrackByAlbum(trackName)]);

    // filter flatData so it only contains unique tracks based on track.id
    const uniqueTracks: Track[] = [];

    data.forEach((d) => {
      d.forEach((t: Track) => {
        if (uniqueTracks.findIndex((ut) => ut.id === t.id) === -1) {
          uniqueTracks.push(t);
        }
      });
    });

    // dispatch(setRecStatus(IDLE));
    dispatch(setTracks(uniqueTracks));
  }, 500);

  useEffect(() => {
    if (searchTerm) {
      // TODO: adjust this conditional to be a state that changes on new search term instead of result length
      // if (true) dispatch(setRecStatus(LOADING));
      debouncedSearch(searchTerm);
    }
    return () => {
      // dispatch(setRecStatus(IDLE));
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch, dispatch]);

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
