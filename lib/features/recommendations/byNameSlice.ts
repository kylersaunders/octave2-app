import { createAppSlice } from '@/lib/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TrackPlus } from '../builder/builderSlice';
import { SEEDS_IDLE_PHRASE, SEEDS_MAX_PHRASE } from '@/lib/constants';
import { RecommendationsData } from '@/types/tracks';

export interface RecsByNameSliceState {
  tracks: Array<TrackPlus | RecommendationsData | null>;
  searchTerm?: string;
  status: typeof SEEDS_IDLE_PHRASE | 'busy' | 'error' | 'success';
}

const initialState: RecsByNameSliceState = {
  tracks: [],
  searchTerm: '',
  status: 'idle',
};

export const recsByNameSlice = createAppSlice({
  name: 'tracks',
  initialState,
  reducers: (create) => ({
    setTracks: create.reducer((state, action: PayloadAction<TrackPlus[]>) => {
      state.tracks = action.payload;
    }),
    clearTracks: create.reducer((state) => {
      state.tracks = [];
    }),
    setSearchTerm: create.reducer((state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    }),
  }),
  selectors: {
    selectRecTracks: (state) => state.tracks,
    selectTracksStatus: (state) => state.status,
    selectSearchTerm: (state) => state.searchTerm,
  },
});

export const { setTracks, clearTracks, setSearchTerm } = recsByNameSlice.actions;
export const { selectRecTracks, selectTracksStatus, selectSearchTerm } = recsByNameSlice.selectors;
