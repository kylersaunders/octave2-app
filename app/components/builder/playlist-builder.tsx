'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TrackPlus, removeTrack, selectPlaylistTracks } from '@/lib/features/builder/builderSlice';
import { useAppSelector } from '@/lib/hooks';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { summarizeArtistsMaxN } from '../recommendations/components/recs-columns';

export default function PlaylistBuilder() {
  const tracks = useAppSelector(selectPlaylistTracks);
  const [goal, setGoal] = useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }
  return (
    // <Sheet>
    //   <SheetTrigger asChild>
    //     <Button variant='outline'>Playlist Builder</Button>
    //   </SheetTrigger>
    //   <SheetContent side='right' className='w-[1000px]'>
    //     <SheetHeader>
    //       <SheetTitle>Edit playlist</SheetTitle>
    //       <SheetDescription>{`Make changes to your playlist here`}</SheetDescription>
    //     </SheetHeader>
    <div className='grid gap-4 py-4'>
      {/* Just list out the basic elements of track - join the artists, the duration, and an x to remove from the playlist */}
      {tracks.length ? (
        // give me headers here
        <div className='grid grid-cols-4 gap-1'>
          <div>Name</div>
          <div>Artists</div>
          <div>Duration</div>
          <div></div>
        </div>
      ) : null}
      {tracks.map((track: TrackPlus, index: number) => (
        <div key={track.id} className='grid grid-cols-4 gap-1'>
          <div>{track.name}</div>
          <div>{summarizeArtistsMaxN(track.artists, 3)}</div>
          <div>{track.duration_ms}</div>
          <div>
            <Button variant='destructive' onClick={() => removeTrack(tracks[index].id)}>
              x
            </Button>
          </div>
        </div>
      ))}
    </div>
    //     <SheetFooter>
    //       <SheetClose asChild>
    //         <Button type='submit'>Save changes</Button>
    //       </SheetClose>
    //     </SheetFooter>
    //   </SheetContent>
    // </Sheet>
  );
}
