'use client';

import { Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { addTrack, selectStatus, selectPlaylistTracks } from '@/lib/features/builder/builderSlice';

import { addSeed, selectSeeds, selectSeedsStatus } from '@/lib/features/recommendations/recommendationsSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Counter.module.css';
import { TrackPlus } from '@/lib/features/builder/builderSlice';
import { Open } from '@/types/utils';
import { SEEDS_MAX_PHRASE } from '@/lib/constants';
import { addPlaylists, selectPlaylists } from '@/lib/features/playlists/playlistsSlice';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function ButtonAddToSeeds<TData>({ row }: DataTableRowActionsProps<TData>) {
  const track = row.original as TrackPlus;
  const dispatch = useAppDispatch();
  const seeds = useAppSelector(selectSeeds);

  function handleAddToSeeds() {
    console.log('+seed', track.id);

    // @ts-ignore
    const temp = new Set(seeds.map((seed) => seed?.id));

    if (temp.has(track.id)) return;
    dispatch(addSeed(row.original as TrackPlus));
  }

  // @ts-ignore
  if (new Set(seeds.map((x) => x?.id)).has(track.id)) {
    return <Button disabled={true}>{`Seeded`}</Button>;
  }
  if (seeds?.length >= 5) {
    return <Button disabled={true}>{`Limit reached`}</Button>;
  }

  return <Button onClick={handleAddToSeeds}>{`+ Seed`}</Button>;
}

export function ButtonAddToPlaylist<TData>({ row }: DataTableRowActionsProps<TData>) {
  const track = row.original as TrackPlus;
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectPlaylistTracks);

  function handleAddToPlaylist() {
    console.log('+track', track.id);

    const temp = new Set(tracks.map((track) => track.id));

    if (temp.has(track.id)) return;
    dispatch(addTrack(row.original as TrackPlus));
  }

  if (new Set(tracks.map((x) => x.id)).has(track.id)) {
    return <Button disabled={true}>{`In playlist`}</Button>;
  }

  return <Button onClick={handleAddToPlaylist}>{`+ Playlist`}</Button>;
}

export function AddDropDownButton<TData>({ row }: DataTableRowActionsProps<TData>) {
  const track = row.original as TrackPlus;
  const dispatch = useAppDispatch();
  const seeds = useAppSelector(selectSeeds);
  const status = useAppSelector(selectStatus);
  const playlists = useAppSelector(selectPlaylists);

  // const fetchPlaylists = useCallback(async () => {
  //   try {
  //     const data = await getUserPlaylists();

  //     const adjustedUserPlaylists = data.items?.map((playlist: UsersPlaylists) => ({
  //       ...playlist,
  //       imageUrl: playlist.images?.find((x) => x.height === 60)?.url ?? '#',
  //       owner: playlist.owner.display_name,
  //       tracksTotal: playlist.tracks.total,
  //     }));

  //     if (adjustedUserPlaylists?.length > 0) dispatch(addPlaylists(adjustedUserPlaylists));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [dispatch]);

  // useEffect(() => {
  //   // if (!playlists.length) fetchPlaylists();
  // }, []);

  function handleAddToSeeds() {
    console.log('+seed', track.id);

    // @ts-ignore
    const temp = new Set(seeds.map((seed) => seed?.id));

    if (temp.has(track.id)) return;
    dispatch(addSeed(row.original as TrackPlus));
  }

  function handleAddToPlaylist() {
    console.log('+track', track.id);

    // @ts-ignore
    const temp = new Set(seeds.map((seed) => seed?.id));

    if (temp.has(track.id)) return;
    dispatch(addTrack(row.original as TrackPlus));
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'}>+</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={5} alignOffset={5}>
          <DropdownMenuItem onClick={handleAddToSeeds}>Add to seed tracks</DropdownMenuItem>
          {/* <DropdownMenuItem onClick={handleAddToPlaylist}>Add to Playlist</DropdownMenuItem> */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Add to playlist</span>
            </DropdownMenuSubTrigger>
            {/* <DropdownMenuPortal> */}
            <DropdownMenuSubContent>
              {playlists.map((playlist: any) => (
                <DropdownMenuItem key={playlist.id} onClick={() => console.log('adding to ' + row.id)}>
                  <span>{playlist.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
            {/* </DropdownMenuPortal> */}
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
