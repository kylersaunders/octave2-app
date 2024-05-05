'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { set, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getRecommendations } from '@/actions/tracks';
import { RecommendationsData, Track } from '@/types/tracks';
import { selectStatus, selectRecs } from '@/lib/features/counter/playlistSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import styles from './Counter.module.css';
import { TrackPlus } from '@/lib/features/counter/playlistSlice';
import SeedTracks from '@/app/components/seed-tracks';
import { addSeed, selectSeeds } from '@/lib/features/seeds/seedsSlice';
import { DataTable } from './recommendation-table/data-table';
import { useState } from 'react';
import { columns } from './recommendation-table/components/columns';
import { clearTracks, selectTracks, setSearchTerm, setTracks } from '@/lib/features/tracks/tracksSlice';

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

const defaultValues: Partial<RecommendationInputFormValues> = {
  seedTracks: ['12jmCJskrYkrEEy6rUlQ0W'],
};

export function InputsForm() {
  console.log('InputsForm rerendered');
  const dispatch = useAppDispatch();
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

    dispatch(setTracks(tracks.tracks));
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-row justify-center space-x-4 min-w-[25vw] max-w-[95vw] overflow-x-auto m-4'>
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
      </Form>
    </>
  );
}
