'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchTab from '../components/search';
import RecommendationsTab from '../components/recommendations';
import PlaylistsTab from '../components/playlists/view-my-playlists';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  console.log('Home');
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs defaultValue='search' className='mx-8'>
        <TabsList className='grid grid-cols-3'>
          <TabsTrigger value='recommendations'>Recommendations</TabsTrigger>
          <TabsTrigger value='search'>Search</TabsTrigger>
          <TabsTrigger value='playlists'>Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value='recommendations'>
          <RecommendationsTab />
        </TabsContent>

        <TabsContent value='search'>
          <SearchTab />
        </TabsContent>

        <TabsContent value='playlists'>
          <PlaylistsTab />
        </TabsContent>
      </Tabs>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
