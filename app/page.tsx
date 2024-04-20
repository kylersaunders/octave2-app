import Image from 'next/image';
import CreatePage from './create/page';
import PlaylistPage from './playlist/page';

export default function Home() {
  console.log('Home rendered');
  return (
    <main className='flex flex-col justify-center items-center space-y-4'>
      <>
        <PlaylistPage />
        <CreatePage />
      </>
    </main>
  );
}
