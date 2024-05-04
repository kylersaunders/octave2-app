import Image from 'next/image';
import CreatePage from './create/page';
import PlaylistPage from './playlist/page';
import { InputsForm } from './create/components/recommendation-inputs/recommendation-inputs';

export default function Home() {
  console.log('Home rendered');
  return (
    <div className='flex flex-col justify-center items-center space-x-8'>
      <PlaylistPage />
      {/* <CreatePage /> */}
      <InputsForm />
    </div>
  );
}
