import { createAppSlice } from '@/lib/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TrackPlus } from '../builder/builderSlice';
import { SEEDS_IDLE_PHRASE, SEEDS_MAX_PHRASE } from '@/lib/constants';
import { RecommendationsData } from '@/types/tracks';

export interface RecsByArtistState {
  tracks: Array<TrackPlus | RecommendationsData | null>;
  searchTerm?: string;
  status: typeof SEEDS_IDLE_PHRASE | 'busy' | 'error' | 'success';
}

const initialState: RecsByArtistState = {
  tracks: [],
  searchTerm: '',
  status: 'idle',
};

export const recsByArtistSlice = createAppSlice({
  name: 'tracks',
  initialState,
  reducers: (create) => ({
    setTracksByArtist: create.reducer((state, action: PayloadAction<TrackPlus[]>) => {
      state.tracks = action.payload;
    }),
    clearTracksByArtist: create.reducer((state) => {
      state.tracks = [];
    }),
  }),
  selectors: {
    selectRecsByArtist: (state) => state.tracks,
    selectTracksStatus: (state) => state.status,
  },
});

export const { setTracksByArtist, clearTracksByArtist } = recsByArtistSlice.actions;
export const { selectRecsByArtist, selectTracksStatus } = recsByArtistSlice.selectors;
