import { useState } from 'react';
import { addSeed, removeSeed, selectSeeds, selectSeedsStatus } from '@/lib/features/seeds/seedsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export default function SeedTracks() {
  console.log('SeedTracks rendered');
  const dispatch = useAppDispatch();
  const seeds = useAppSelector(selectSeeds);
  const status = useAppSelector(selectSeedsStatus);
  // const [inputValue, setInputValue] = useState('');

  // function handleAddSeed() {
  //   dispatch(addSeed(inputValue));
  //   setInputValue('');
  // }

  function handleRemoveSeed(seedId: string) {
    dispatch(removeSeed(seedId));
  }

  return (
    <div className='max-w-[25vw] max-h-[10vh] space-y-4 overflow-auto'>
      {/* <div className='flex flex-row'>
        <input type='text' value={inputValue} onChange={(e) => setInputValue(e.target.value)} className='border border-gray-300 rounded-md p-2' />
        <button onClick={handleAddSeed} className='ml-2 bg-blue-500 text-white rounded-md p-2'>
          Add Seed
        </button>
      </div> */}
      {/* label for seeds */}
      <label htmlFor='seeds'>Seed Tracks</label>
      {/* input for seeds */}
      <div className='flex flex-row flex-wrap'>
        {seeds.map((seed) => (
          <div key={seed.id} className='flex flex-row items-center space-x-2'>
            <span>{seed.name}</span>
            <button onClick={() => handleRemoveSeed(seed.id)} className='bg-red-500 text-white rounded-md p-2'>
              Remove
            </button>
          </div>
        ))}
      </div>
      {status === 'max_exceeded' ? <div>Max seeds exceeded</div> : null}
    </div>
  );
}
