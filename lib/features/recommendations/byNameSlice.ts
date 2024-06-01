import { createAppSlice } from '@/lib/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TrackPlus } from '../builder/builderSlice';
import { RecommendationsData } from '@/types/tracks';
import { Status } from '@/types/common';

export interface RecsByNameSliceState {
  tracks: Array<TrackPlus | RecommendationsData | null>;
  searchTerm?: string;
  status: Status;
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
    setRecStatus: create.reducer((state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    }),
  }),
  selectors: {
    selectRecTracks: (state) => state.tracks,
    selectTracksStatus: (state) => state.status,
    selectSearchTerm: (state) => state.searchTerm,
    selectRecStatus: (state) => state.status,
  },
});

export const { setTracks, clearTracks, setSearchTerm, setRecStatus } = recsByNameSlice.actions;
export const { selectRecTracks, selectTracksStatus, selectSearchTerm, selectRecStatus } = recsByNameSlice.selectors;
