'use client';

import { setTracks, selectSearchTerm, setSearchTerm } from '@/lib/features/recommendations/byNameSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { searchTrackByAlbum, searchTrackByArtist, searchTrackByName } from '@/actions/tracks';
import { debounce } from 'lodash';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { Track } from '@/types/tracks';

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

    dispatch(setTracks(uniqueTracks));
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