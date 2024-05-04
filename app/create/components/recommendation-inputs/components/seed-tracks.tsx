import { useState } from 'react';
import { addSeed, removeSeed, selectSeeds, selectSeedsStatus } from '@/lib/features/seeds/seedsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import SearchTracks from './search-tracks';

export default function SeedTracks() {
  console.log('SeedTracks rendered');
  const dispatch = useAppDispatch();
  const seeds = useAppSelector(selectSeeds);
  const status = useAppSelector(selectSeedsStatus);

  function handleRemoveSeed(seedId: string) {
    dispatch(removeSeed(seedId));
  }

  return (
    <div className='min-w-[10vw] max-h-[10vh] space-y-4 overflow-auto'>
      <label htmlFor='seeds'>Seed Tracks</label>
      <SearchTracks />
      <div className='grid grid-cols-[1fr_4fr]'>
        {seeds.map((seed) => (
          <>
            <div key={'x' + seed.id} className='flex flex-row items-center m-1'>
              <Button variant='destructive' size='sm' onClick={() => handleRemoveSeed(seed.id)}>
                x
              </Button>
            </div>
            <div key={'name' + seed.id} className='flex flex-row items-center m-1'>
              <span>{seed.name}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
