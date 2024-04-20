'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { set, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getRecommendations } from '@/actions/tracks';
import { RecommendationsData, Track } from '@/types/tracks';
import { selectStatus, selectTracks } from '@/lib/features/counter/counterSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Counter.module.css';
import { TrackPlus } from '@/lib/features/counter/counterSlice';
import SeedTracks from '@/app/create/components/recommendation-inputs/components/seed-tracks';
import { selectSeeds } from '@/lib/features/seeds/seedsSlice';

// target schema:
{
  /* <label htmlFor='seedGenres'>Seed Genres</label>
          <input type='text' id='seedGenres' name='seedGenres' />
          <label htmlFor='seedArtists'>Seed Artists</label>
          <input type='text' id='seedArtists' name='seedArtists' />
          <label htmlFor='seedTracks'>Seed Tracks</label>
          <input type='text' id='seedTracks' name='seedTracks' />
          <label htmlFor='limit'>Limit</label>
          <input type='number' id='limit' name='limit' />
          <label htmlFor='market'>Market</label>
          <input type='text' id='market' name='market' />
          <label htmlFor='targetDanceability'>Target Danceability</label>
          <input type='number' id='targetDanceability' name='targetDanceability' />
          <label htmlFor='targetDuration_ms'>Target Duration</label>
          <input type='number' id='targetDuration_ms' name='targetDuration_ms' />
          <label htmlFor='targetEnergy'>Target Energy</label>
          <input type='number' id='targetEnergy' name='targetEnergy' />
          <label htmlFor='minTempo'>Min Tempo</label>
          <input type='number' id='minTempo' name='minTempo' />
          <label htmlFor='maxTempo'>Max Tempo</label>
          <input type='number' id='maxTempo' name='maxTempo' /> */
}
const inputFormSchema = z.object({
  seedGenres: z.array(z.string()).optional(),
  seedArtists: z.array(z.string()).optional(),
  seedTracks: z.array(z.string()).optional(),
  limit: z.string().optional(),
  market: z.string().optional(),
  targetDanceability: z.string().optional(),
  targetDuration: z.string().regex(/^([0-5]?[0-9]):([0-5]?[0-9])$/, 'Invalid time format'),
  targetEnergy: z.string().optional(),
  minTempo: z.string().optional(),
  maxTempo: z.string().optional(),
});

export type RecommendationInputFormValues = z.infer<typeof inputFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<RecommendationInputFormValues> = {
  seedTracks: ['12jmCJskrYkrEEy6rUlQ0W'],
  limit: '20',
  // market: 'US',
  targetEnergy: '0.5',
  targetDanceability: '0.5',
  targetDuration: '2:22',
  minTempo: '120',
  maxTempo: '180',
};

export function InputsForm({ setData }: any) {
  console.log('InputsForm rerendered');
  const seedTracks = useAppSelector(selectSeeds);

  const form = useForm<RecommendationInputFormValues>({
    resolver: zodResolver(inputFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // const { fields, append } = useFieldArray({
  //   name: 'urls',
  //   control: form.control,
  // });

  async function onSubmit(data: RecommendationInputFormValues) {
    const [minutes, seconds] = data.targetDuration.split(':').map(Number);
    const targetDurationMs = ((minutes * 60 + seconds) * 1000).toString();

    const tracks = await getRecommendations({
      seedTracks: seedTracks.length ? seedTracks.map((track: TrackPlus) => track.id) : ['11dFghVXANMlKmJXsNCbNl'],
      // seed_artists: data.seedArtists,
      // seed_genres: data.seedGenres,
      limit: data.limit,
      // market: data.market,
      targetDanceability: data.targetDanceability,
      targetDurationMs,
      targetEnergy: data.targetEnergy,
      minTempo: data.minTempo === data.maxTempo ? Math.max(0, parseInt(data.minTempo || '0') - 1).toString() : data.minTempo,
      maxTempo: data.maxTempo === data.minTempo ? Math.min(300, parseInt(data.maxTempo || '300') + 1).toString() : data.maxTempo,
    });

    // need to get tempo

    const tracksData: RecommendationsData = tracks.tracks.map((track: Track) => {
      return {
        id: track.id,
        name: track.name,
        album: track.album.name,
        artists: track.artists.map((artist: any) => artist.name).join(', '),
        duration: track.duration_ms,
        preview: track.preview_url,
        popularity: track.popularity,
      };
    });
    setData(tracksData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-row justify-center space-x-4 max-w-[85vw] overflow-x-auto'>
        {/* <FormField
          control={form.control}
          name='seedGenres'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seed Genres</FormLabel>
              <FormControl>
                <Input placeholder='pop' {...field} />
              </FormControl>
              <FormDescription>Comma separated list of genres</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='seedArtists'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seed Artists</FormLabel>
              <FormControl>
                <Input placeholder='6vWDO969PvNqNYHIOW5v0m' {...field} />
              </FormControl>
              <FormDescription>Comma separated list of artist IDs</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name='seedTracks'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seed Tracks</FormLabel>
              <FormControl>
                <Input placeholder='12jmCJskrYkrEEy6rUlQ0W' {...field} />
              </FormControl>
              <FormDescription>Comma separated list of track IDs</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <SeedTracks />
        {/* <FormField
          control={form.control}
          name='market'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Market</FormLabel>
              <FormControl>
                <Input placeholder='US' {...field} />
              </FormControl>
              <FormDescription>ISO 3166-1 alpha-2 country code</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name='targetDuration'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='MM:SS'
                  {...field}
                  onChange={(e) => {
                    console.log('field', field);
                    if (e.target.value.match(/^([0-5]?[0-9]):([0-5]?[0-9])$/)) {
                      field.onChange(e.target.value);
                    } else {
                      field.onChange(e.target.value);
                      form.setError('targetDuration', {
                        type: 'manual',
                        message: 'Invalid time format - use MM:SS',
                      });
                    }
                  }}
                />
              </FormControl>
              {/* <FormDescription>Target duration</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='targetDanceability'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danceability</FormLabel>
              <FormControl>
                <Input type='number' placeholder='0.5' min='0' max='1' step='0.1' {...field} />
              </FormControl>
              {/* <FormDescription>Target danceability</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='targetEnergy'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Energy</FormLabel>
              <FormControl>
                <Input type='number' placeholder='0.5' min='0' max='1' step='0.1' {...field} />
              </FormControl>
              {/* <FormDescription>Target energy</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='minTempo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Tempo</FormLabel>
              <FormControl>
                <Input type='number' placeholder='120' min='0' max='300' step='1' {...field} />
              </FormControl>
              {/* <FormDescription>Minimum tempo</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='maxTempo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Tempo</FormLabel>
              <FormControl>
                <Input type='number' placeholder='180' min='0' max='300' step='1' {...field} />
              </FormControl>
              {/* <FormDescription>Maximum tempo</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='limit'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limit</FormLabel>
              <FormControl>
                <Input type='number' placeholder='20' min='0' max='100' step='1' {...field} />
              </FormControl>
              {/* <FormDescription>Number to return</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Go!</Button>
      </form>
    </Form>
  );
}
