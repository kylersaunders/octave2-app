import ViewMyPlaylists from './components/playlists/view-my-playlists';
import PlaylistBuilder from './components/builder/playlist-builder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Recommendations from './components/recommendations/recommendations';

export default function Home() {
  console.log('Home rendered');
  return (
    <>
      <Tabs defaultValue='recommendations' className='mx-8'>
        <TabsList className='grid grid-cols-2'>
          <TabsTrigger value='recommendations'>Get Recommendations</TabsTrigger>
          <TabsTrigger value='playlists'>My Playlists</TabsTrigger>
          {/* <TabsTrigger value='builder'>Build New Playlist</TabsTrigger> */}
        </TabsList>

        <TabsContent value='recommendations'>
          <Recommendations />
        </TabsContent>

        <TabsContent value='playlists'>
          <ViewMyPlaylists />
        </TabsContent>

        {/* <TabsContent value='builder'>
          <PlaylistBuilder />
        </TabsContent> */}
      </Tabs>
    </>
  );
}
