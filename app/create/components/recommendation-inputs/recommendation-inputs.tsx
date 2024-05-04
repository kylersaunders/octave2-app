'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { set, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getRecommendations } from '@/actions/tracks';
import { RecommendationsData, Track } from '@/types/tracks';
import { selectStatus, selectRecs } from '@/lib/features/counter/counterSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Counter.module.css';
import { TrackPlus } from '@/lib/features/counter/counterSlice';
import SeedTracks from '@/app/create/components/recommendation-inputs/components/seed-tracks';
import { addSeed, selectSeeds } from '@/lib/features/seeds/seedsSlice';
import { DataTable } from '../recommendation-table/data-table';
import { useState } from 'react';
import { columns } from '../recommendation-table/components/columns';
import { clearTracks, selectTracks, setSearchTerm } from '@/lib/features/tracks/tracksSlice';

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
  targetDuration: z
    .string()
    .regex(/^([0-5]?[0-9]):([0-5]?[0-9])$/, 'Invalid time format')
    .optional(),
  targetEnergy: z.string().optional(),
  minTempo: z.string().optional(),
  maxTempo: z.string().optional(),
});

export type RecommendationInputFormValues = z.infer<typeof inputFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<RecommendationInputFormValues> = {
  seedTracks: ['12jmCJskrYkrEEy6rUlQ0W'],
  // limit: '20',
  // market: 'US',
  // targetEnergy: '0.5',
  // targetDanceability: '0.5',
  // targetDuration: '2:22',
  // minTempo: '120',
  // maxTempo: '180',
};

export function InputsForm() {
  console.log('InputsForm rerendered');
  const [data, setData] = useState<RecommendationsData[]>();
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
    const recommendationsParamsObject = {
      ...data,
    };
    if (seedTracks.length) {
      recommendationsParamsObject.seedTracks = seedTracks.map((track: TrackPlus) => track.id);
    }
    if (data.targetDuration) {
      const [minutes, seconds] = data.targetDuration.split(':').map(Number);
      const newMs = ((minutes * 60 + seconds) * 1000).toString();
      set(recommendationsParamsObject, 'targetDurationMs', newMs);
      if (!data.targetDanceability) {
        recommendationsParamsObject.targetDanceability = '0.5';
      }
    }
    if (data.minTempo === data.maxTempo && data.minTempo) {
      recommendationsParamsObject.minTempo = Math.max(0, parseInt(data.minTempo || '0') - 1).toString();
    }
    if (data.maxTempo === data.minTempo && data.maxTempo) {
      recommendationsParamsObject.maxTempo = Math.min(300, parseInt(data.maxTempo || '300') + 1).toString();
    }

    const tracks = await getRecommendations(recommendationsParamsObject);

    // need to get tempo

    const tracksData: RecommendationsData[] = tracks.tracks.map((track: Track) => {
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

  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectTracks);

  function handleAddSeed(track: TrackPlus) {
    dispatch(addSeed(track));
    dispatch(clearTracks());
    dispatch(setSearchTerm(''));
  }

  return (
    <>
      <Form {...form}>
        {/* <div className='sticky top-20 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'> */}
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-row justify-center space-x-4 max-w-[85vw] overflow-x-auto m-4'>
          <SeedTracks />
          <FormField
            control={form.control}
            name='targetDuration'
            render={({ field }) => (
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Duration</FormLabel>
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
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Danceability</FormLabel>
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
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Energy</FormLabel>
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
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Min Tempo</FormLabel>
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
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Max Tempo</FormLabel>
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
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Limit</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='20' min='0' max='100' step='1' {...field} />
                </FormControl>
                {/* <FormDescription>Number to return</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-1'>
            <div className='h-4'></div>
            <Button type='submit'>Go!</Button>
          </div>
        </form>
        {/* </div> */}
      </Form>
      {tracks.length > 0 &&
        tracks.map((track: TrackPlus, ind: number) => (
          <div key={ind} className='grid grid-cols-[3fr_1fr_3fr_2fr]'>
            <audio controls src={track.preview_url}></audio>
            <Button onClick={() => handleAddSeed(track)}>Add Seed</Button>
            <span>{track.name}</span>
            <span>
              {track.artists
                .map((x) => {
                  // console.log('x', x);
                  return x.name;
                })
                .join(',')}
            </span>
          </div>
        ))}
      {data ? <DataTable data={data} columns={columns} /> : null}
    </>
  );
}
