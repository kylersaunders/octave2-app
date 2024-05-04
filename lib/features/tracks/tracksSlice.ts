import { createAppSlice } from '@/lib/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TrackPlus } from '../counter/counterSlice';
import { SEEDS_IDLE_PHRASE, SEEDS_MAX_PHRASE } from '@/lib/constants';

export interface TracksSliceState {
  tracks: TrackPlus[];
  searchTerm?: string;
  status: typeof SEEDS_IDLE_PHRASE | 'busy' | 'error' | 'success';
}

const initialState: TracksSliceState = {
  tracks: [],
  searchTerm: '',
  status: 'idle',
};

export const tracksSlice = createAppSlice({
  name: 'tracks',
  initialState,
  reducers: (create) => ({
    addTracks: create.reducer((state, action: PayloadAction<TrackPlus[]>) => {
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
    selectTracks: (state) => state.tracks,
    selectTracksStatus: (state) => state.status,
    selectSearchTerm: (state) => state.searchTerm,
  },
  // getTracks: async (dispatch, getState, trackName: string) => {
  //   dispatch(tracksSlice.actions.clearTracks());
  //   const response = await fetch(`/search-tracks?trackName=${trackName}`);
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch tracks');
  //   }
  //   const data = await response.json();
  //   dispatch(tracksSlice.actions.addTracks(data.tracks));
  // },
  // getTracksAsync: create.asyncThunk(
  //   async (title: string) => {
  //     const response = await getTracks(title);
  //     const tracks = await response.json();
  //     return tracks;
  //   },
  //   {
  //     pending: (state) => {
  //       state.status = 'loading';
  //     },
  //     fulfilled: (state, action) => {
  //       state.status = 'idle';
  //       state.tracks = state.tracks.map((track: TrackPlus) => {
  //         if (track.id === action.meta.arg.id) {
  //           track.tempo = action.payload;
  //         }
  //         return track;
  //       });
  //     },
  //     rejected: (state) => {
  //       state.status = 'failed';
  //     },
  //   }
  // ),
});

export const { addTracks, clearTracks, setSearchTerm } = tracksSlice.actions;
export const { selectTracks, selectTracksStatus, selectSearchTerm } = tracksSlice.selectors;
