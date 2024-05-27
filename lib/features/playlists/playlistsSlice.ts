import { createAppSlice } from '@/lib/createAppSlice';
import type { AppThunk } from '@/lib/store';
import type { PayloadAction } from '@reduxjs/toolkit';
// import { fetchCount } from './counterAPI';
import { addTracksToPlaylist, createPlaylist, getTempo } from '@/actions/tracks';
import { Track } from '@/types/tracks';
import { Playlist } from '@/types/playlists';
import { remove } from 'lodash';

export interface TrackPlus extends Track {
  tempo?: number;
}

export interface PlaylistSliceState {
  playlists: Playlist[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PlaylistSliceState = {
  playlists: [],
  status: 'idle',
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const playlistSlice = createAppSlice({
  name: 'playlists',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    addPlaylists: create.reducer((state, action: PayloadAction<Playlist[]>) => {
      if (action.payload?.length === 0) return;

      // check for duplicates by each playlist.id
      const newPlaylists = action.payload?.filter((playlist) => {
        return state.playlists.findIndex((x) => x.id === playlist.id) === -1;
      });
      state.playlists = [...state.playlists, ...(newPlaylists || [])];
    }),
    removePlaylist: create.reducer((state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter((playlist) => playlist.id !== action.payload);
    }),
  }),

  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectPlaylists: (playlists) => playlists.playlists,
    selectStatus: (playlists) => playlists.status,
  },
});

// Action creators are generated for each case reducer function.
export const { addPlaylists, removePlaylist } = playlistSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectPlaylists, selectStatus } = playlistSlice.selectors;
