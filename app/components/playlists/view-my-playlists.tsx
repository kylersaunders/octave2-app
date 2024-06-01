'use client';

import { getUserPlaylists } from '@/actions/playlists';
import { DataTable } from '@/components/data-table/data-table';
import { addPlaylists, selectPlaylists } from '@/lib/features/playlists/playlistsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Playlist, UsersPlaylists } from '@/types/playlists';
import { useCallback, useEffect, useState } from 'react';
import { playlistColumns } from './components/playlists-columns';
import SelectedPlaylist from './selected-playlist/selected-playlist';

export default function ViewMyPlaylists() {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector(selectPlaylists);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>();

  const fetchPlaylists = useCallback(async () => {
    try {
      const data = await getUserPlaylists();

      const adjustedUserPlaylists = data.items?.map((playlist: UsersPlaylists) => ({
        ...playlist,
        imageUrl: playlist.images?.find((x) => x.height === 60)?.url ?? '#',
        owner: playlist.owner.display_name,
        tracksTotal: playlist.tracks.total,
      }));

      if (adjustedUserPlaylists?.length > 0) dispatch(addPlaylists(adjustedUserPlaylists));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  function selectPlaylist(row: any) {
    setSelectedPlaylistId(row.id);
  }

  // renders a datatable w/data of playlists and columns of playlists-cols
  // this should persist in state and be refreshed if a mutation is detected from the UI
  // on click, renders a datatable w/data of tracks and columns of tracks-cols
  // no need to persist this past local state
  // could cache this data in local storage for performance

  if (selectedPlaylistId) {
    return <SelectedPlaylist id={selectedPlaylistId} back={setSelectedPlaylistId} />;
  }
  if (playlists.length) {
    // @ts-ignore
    return <DataTable data={playlists} columns={playlistColumns} callbackOnClick={selectPlaylist} />;
  }
  return <div>No playlists found</div>;
}
