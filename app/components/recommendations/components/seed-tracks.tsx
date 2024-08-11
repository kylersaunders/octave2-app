'use client';
import { addSeed, removeSeed, selectSeeds, selectSeedsStatus } from '@/lib/features/recommendations/recommendationsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';

export default function SeedTracks() {
  console.log('SeedTracks rendered');
  const dispatch = useAppDispatch();
  const seeds = useAppSelector(selectSeeds);

  function handleRemoveSeed(seedId: string) {
    dispatch(removeSeed(seedId));
  }

  if (seeds.length)
    return (
      <div className='flex flex-row items-center justify-center space-x-4'>
        <label htmlFor='seeds' className='ml-2'>
          Seed Tracks
        </label>
        <div className='flex flex-row border rounded-md p-2'>
          {seeds.map((seed, ind) => (
            <Button key={ind} variant='ghost' onClick={() => handleRemoveSeed(seed?.id || '')} className='h-8 px-2 lg:px-3'>
              {seed?.name}
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          ))}
        </div>
      </div>
    );

  return <></>;
}
