import SearchTracks from './components/search-tracks';
import { Card } from '@/components/ui/card';
import ResultsTable from './components/results';
import AdvancedSearch from './components/advanced-search/advanced-search';
import ViewMyPlaylists from './components/view-my-playlists/view-my-playlists';
import PlaylistBuilder from './components/playlist-builder/playlist-builder';

export default function Home() {
  console.log('Home rendered');
  return (
    <>
      <div className='flex flex-row justify-between items-center px-4'>
        <div className='w-[10vw]'></div>
        <div className='flex flex-row justify-center items-center space-x-4 px-8'>
          <ViewMyPlaylists />
          <SearchTracks />
          <AdvancedSearch />
        </div>
        <PlaylistBuilder />
      </div>
      <ResultsTable />
    </>
  );
}
