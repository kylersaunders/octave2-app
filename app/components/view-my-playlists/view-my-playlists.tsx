'use client';

import { getUserPlaylists } from '@/actions/playlists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Playlist } from '@/types/playlists';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ViewMyPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  async function fetchPlaylists() {
    try {
      const response = await getUserPlaylists();
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline'>My Playlists</Button>
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>My Playlists</SheetTitle>
        </SheetHeader>
        {true &&
          playlists.map((playlist: Playlist) => (
            <div key={playlist.id}>
              {/* <img src={playlist.images[0].url} alt={playlist.name} /> */}
              <div>{playlist.name}</div>
              <div>{playlist.tracks.total} tracks</div>
              <Button onClick={() => setSelectedPlaylist(playlist.id)}>View</Button>
            </div>
          ))}
      </SheetContent>
    </Sheet>
  );
}
