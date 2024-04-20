import { createAppSlice } from '@/lib/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TrackPlus } from '../counter/counterSlice';

export interface SeedsSliceState {
  seeds: TrackPlus[];
  status: 'idle' | 'max_exceeded';
}

const initialState: SeedsSliceState = {
  seeds: [],
  status: 'idle',
};

export const seedsSlice = createAppSlice({
  name: 'seeds',
  initialState,
  reducers: (create) => ({
    addSeed: create.reducer((state, action: PayloadAction<TrackPlus>) => {
      // show error if more than 5 seeds
      if (state.seeds.length >= 5) {
        state.status = 'max_exceeded';
      } else {
        state.seeds.push(action.payload);
      }
    }),
    removeSeed: create.reducer((state, action: PayloadAction<string>) => {
      state.seeds = state.seeds.filter((seed) => seed.id !== action.payload);
    }),
    clearSeeds: create.reducer((state) => {
      state.seeds = [];
    }),
  }),
  selectors: {
    selectSeeds: (state) => state.seeds,
    selectSeedsStatus: (state) => state.status,
  },
});

export const { addSeed, removeSeed, clearSeeds } = seedsSlice.actions;
export const { selectSeeds, selectSeedsStatus } = seedsSlice.selectors;
