'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getRecommendations } from '@/actions/tracks';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { TrackPlus } from '@/lib/features/builder/builderSlice';
import {
  addSeed,
  selectSearchFilters,
  selectSeeds,
  setLimit,
  setMaxDuration,
  setMaxTempo,
  setMinDuration,
  setMinTempo,
  setTargetDanceability,
  setTargetDuration,
  setTargetEnergy,
  setRecStatus,
  setTracks,
  setMaxSpm,
  setMinSpm,
} from '@/lib/features/recommendations/recommendationsSlice';
import { Status } from '@/types/common';
import { useCallback } from 'react';

const inputFormSchema = z.object({
  seedGenresState: z.array(z.object({}).optional()),
  seedArtistsState: z.array(z.object({}).optional()),
  seedTracksState: z.array(z.object({ id: z.string(), name: z.string() }).optional()),
  seedGenres: z.array(z.string().optional()).optional(),
  seedArtists: z.array(z.string().optional()).optional(),
  seedTracks: z.array(z.string().optional()).optional(),
  limit: z.string().optional(),
  market: z.string().optional(),
  targetDanceability: z.string().optional(),
  minDuration: z
    .string()
    .regex(/^([0-5]?[0-9]):([0-5]?[0-9])$/, 'Invalid time format')
    .optional(),
  targetDuration: z
    .string()
    .regex(/^([0-5]?[0-9]):([0-5]?[0-9])$/, 'Invalid time format')
    .optional(),
  maxDuration: z
    .string()
    .regex(/^([0-5]?[0-9]):([0-5]?[0-9])$/, 'Invalid time format')
    .optional(),
  targetEnergy: z.string().optional(),
  minTempo: z.string().optional(),
  targetTempo: z.string().optional(),
  maxTempo: z.string().optional(),
  minSpm: z.string().optional(),
  targetSpm: z.string().optional(),
  maxSpm: z.string().optional(),
});

export type RecommendationInputFormValues = z.infer<typeof inputFormSchema>;

export function AdvancedSearchForm() {
  console.log('InputsForm rerendered');
  const dispatch = useAppDispatch();
  const seedTracksState = useAppSelector(selectSeeds);
  const filters = useAppSelector(selectSearchFilters);
  const form = useForm<RecommendationInputFormValues>({
    resolver: zodResolver(inputFormSchema),
    values: filters,
    mode: 'onChange',
  });

  const onSubmit = useCallback(
    async (data: RecommendationInputFormValues) => {
      const recommendationsParamsObject = {
        ...data,
      };
      if (seedTracksState?.length) {
        // @ts-expect-error
        recommendationsParamsObject.seedTracks = seedTracksState.map((track: TrackPlus) => {
          return track.id;
        });
      } else {
        recommendationsParamsObject.seedTracks = ['12jmCJskrYkrEEy6rUlQ0W'];
      }
      if (data.minDuration) {
        const [minutes, seconds] = data.minDuration.split(':').map(Number);
        const newMs = ((minutes * 60 + seconds) * 1000).toString();
        set(recommendationsParamsObject, 'minDurationMs', newMs);
      }
      if (data.targetDuration) {
        const [minutes, seconds] = data.targetDuration.split(':').map(Number);
        const newMs = ((minutes * 60 + seconds) * 1000).toString();
        set(recommendationsParamsObject, 'targetDurationMs', newMs);
      }
      if (data.maxDuration) {
        const [minutes, seconds] = data.maxDuration.split(':').map(Number);
        const newMs = ((minutes * 60 + seconds) * 1000).toString();
        set(recommendationsParamsObject, 'maxDurationMs', newMs);
      }
      // convert for rowing
      if (data.minSpm) {
        data.minTempo = (parseInt(data.minSpm) * 4).toString();
      }
      if (data.targetSpm) {
        recommendationsParamsObject.targetTempo = (parseInt(data.targetSpm) * 4).toString();
      }
      if (data.maxSpm) {
        data.maxTempo = (parseInt(data.maxSpm) * 4).toString();
      }
      // check that there's no impossibilities
      if (data.minTempo === data.maxTempo && data.minTempo) {
        recommendationsParamsObject.minTempo = Math.max(0, parseInt(data.minTempo || '0') - 1).toString();
      }
      if (data.maxTempo === data.minTempo && data.maxTempo) {
        recommendationsParamsObject.maxTempo = Math.min(300, parseInt(data.maxTempo || '300') + 1).toString();
      }

      // @ts-expect-error
      const tracks = await getRecommendations(recommendationsParamsObject);

      dispatch(setTracks(tracks.tracks));
    },
    [dispatch, seedTracksState]
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-row justify-center space-x-4 min-w-[25vw] max-w-[95vw] overflow-x-auto m-4'>
          <FormField
            control={form.control}
            name='minDuration'
            render={({ field }) => (
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Min Duration</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='MM:SS'
                    {...field}
                    onChange={(e) => {
                      console.log('field', field);
                      if (e.target.value.match(/^([0-5]?[0-9]):([0-5]?[0-9])$/)) {
                        dispatch(setMinDuration(e.target.value));
                      } else {
                        form.setError('targetDuration', {
                          type: 'manual',
                          message: 'Invalid time format - use MM:SS',
                        });
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='maxDuration'
            render={({ field }) => (
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Max Duration</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='MM:SS'
                    {...field}
                    onChange={(e) => {
                      console.log('field', field);
                      if (e.target.value.match(/^([0-5]?[0-9]):([0-5]?[0-9])$/)) {
                        dispatch(setMaxDuration(e.target.value));
                      } else {
                        form.setError('targetDuration', {
                          type: 'manual',
                          message: 'Invalid time format - use MM:SS',
                        });
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name='minTempo'
            render={({ field }) => (
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Min Tempo</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='120'
                    min='0'
                    max='300'
                    step='1'
                    {...field}
                    onChange={(e) => {
                      dispatch(setMinTempo(e.target.value));
                    }}
                  />
                </FormControl>
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
                  <Input
                    type='number'
                    placeholder='180'
                    min='0'
                    max='300'
                    step='1'
                    {...field}
                    onChange={(e) => {
                      dispatch(setMaxTempo(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name='minSpm'
            render={({ field }) => (
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Min SPM</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    // placeholder='15'
                    min='0'
                    max='75'
                    step='1'
                    {...field}
                    onChange={(e) => {
                      dispatch(setMinSpm(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='maxSpm'
            render={({ field }) => (
              <FormItem className='grid grid-cols-1 w-fit'>
                <FormLabel className='w-fit whitespace-nowrap'>Max SPM</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    // placeholder='30'
                    min='0'
                    max='75'
                    step='1'
                    {...field}
                    onChange={(e) => {
                      dispatch(setMaxSpm(e.target.value));
                    }}
                  />
                </FormControl>
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
                  <Input
                    type='number'
                    placeholder='0.5'
                    min='0'
                    max='1'
                    step='0.1'
                    {...field}
                    onChange={(e) => {
                      dispatch(setTargetDanceability(e.target.value));
                    }}
                  />
                </FormControl>
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
                  <Input
                    type='number'
                    // placeholder='0.5'
                    min='0'
                    max='1'
                    step='0.1'
                    {...field}
                    onChange={(e) => {
                      dispatch(setTargetEnergy(e.target.value));
                    }}
                  />
                </FormControl>
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
                  <Input
                    type='number'
                    placeholder='20'
                    min='0'
                    max='100'
                    step='1'
                    {...field}
                    onChange={(e) => {
                      dispatch(setLimit(e.target.value));
                    }}
                  />
                </FormControl>
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
