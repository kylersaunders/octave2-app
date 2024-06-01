import { getPlaylistTracks } from '@/actions/playlists';
import { DataTable } from '@/components/data-table/data-table';
import { useCallback, useEffect, useState } from 'react';
import { columns } from '../../recommendations/components/recs-columns';
import { Button } from '@/components/ui/button';
import { PlaylistsRowActions } from '../components/playlists-row-actions';

export default function SelectedPlaylist({ id, back }: { id: string; back?: (args: any) => void }) {
  const [selectedPlaylistData, setSelectedPlaylistData] = useState([]);

  const getTracks = useCallback(async (id: string) => {
    // fetch playlist data
    const data = await getPlaylistTracks(id);
    let adjustedData = [];
    if (data.items.length) {
      adjustedData = data.items.map((item: any) => {
        return {
          ...item.track,
          preview_url: item.track.preview_url,
          artists: item.track.artists,
          duration_ms: item.track.duration_ms,
          name: item.track.name,
          tempo: item.track.tempo,
        };
      });
    }

    setSelectedPlaylistData(adjustedData);
  }, []);

  useEffect(() => {
    // fetch playlist data
    getTracks(id);
  }, [id, getTracks]);

  const backButton = () => {
    return (
      <>
        <Button
          onClick={() => {
            if (back) back(null);
          }}
        >
          Back
        </Button>
        <PlaylistsRowActions id={id} />
      </>
    );
  };

  // @ts-ignore
  return (
    <>
      <DataTable data={selectedPlaylistData} columns={columns} callbackOnClick={() => {}} CustomSection={backButton} />
    </>
  );
}
