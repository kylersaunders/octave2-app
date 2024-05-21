import { createAppSlice } from '@/lib/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TrackPlus } from '../playlist/playlistSlice';
import { SEEDS_IDLE_PHRASE, SEEDS_MAX_PHRASE } from '@/lib/constants';
import { RecommendationsData } from '@/types/tracks';

export interface RecsByAlbumState {
  tracks: Array<TrackPlus | RecommendationsData | null>;
  searchTerm?: string;
  status: typeof SEEDS_IDLE_PHRASE | 'busy' | 'error' | 'success';
}

const initialState: RecsByAlbumState = {
  tracks: [],
  searchTerm: '',
  status: 'idle',
};

export const recsByAlbumSlice = createAppSlice({
  name: 'tracks',
  initialState,
  reducers: (create) => ({
    setTracksByAlbum: create.reducer((state, action: PayloadAction<TrackPlus[]>) => {
      state.tracks = action.payload;
    }),
    clearTracksByAlbum: create.reducer((state) => {
      state.tracks = [];
    }),
  }),
  selectors: {
    selectRecsByAlbum: (state) => state.tracks,
    selectTracksStatus: (state) => state.status,
  },
});

export const { setTracksByAlbum, clearTracksByAlbum } = recsByAlbumSlice.actions;
export const { selectRecsByAlbum, selectTracksStatus } = recsByAlbumSlice.selectors;
