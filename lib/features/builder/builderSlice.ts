import { createAppSlice } from '@/lib/createAppSlice';
// import type { AppThunk } from '@/lib/store';
import type { PayloadAction } from '@reduxjs/toolkit';
// import { fetchCount } from './counterAPI';
// import { addTracksToPlaylist, createPlaylist, getTempo } from '@/actions/tracks';
import { Track } from '@/types/tracks';

export interface TrackPlus extends Track {
  tempo?: number;
}

export interface BuilderSliceState {
  id: string;
  title: string;
  tracks: TrackPlus[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: BuilderSliceState = {
  id: '',
  title: 'New Playlist',
  tracks: [],
  status: 'idle',
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const builderSlice = createAppSlice({
  name: 'playlistBuilder',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    setTitle: create.reducer((state, action: PayloadAction<string>) => {
      state.title = action.payload;
    }),
    addTrack: create.reducer((state, action: PayloadAction<Track>) => {
      state.tracks.push(action.payload);
    }),
    removeTrack: create.reducer((state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter((track) => track.id !== action.payload);
    }),
    getTempoAsync: create.asyncThunk(
      async (track: TrackPlus) => {
        // const response = await getTempo(track.id);
        // const tempo = await response.json();
        // return tempo;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'idle';
          state.tracks = state.tracks.map((track: TrackPlus) => {
            if (track.id === action.meta.arg.id) {
              // track.tempo = action.payload;
            }
            return track;
          });
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
    setId: create.reducer((state, action: PayloadAction<string>) => {
      state.id = action.payload;
    }),
    addTracksToPlaylistAsync: create.asyncThunk(
      async ({ playlistId, trackIdList }: { playlistId: string; trackIdList: string[] }) => {
        // const response = await addTracksToPlaylist({ playlistId, trackIdList });
        // return response.data;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'idle';
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectImage: (playlist) => playlist.tracks[0]?.album.images[0].url,
    selectTitle: (playlist) => playlist.title,
    selectId: (playlist) => playlist.id,
    selectPlaylistTracks: (playlist) => playlist.tracks,
    selectStatus: (playlist) => playlist.status,
  },
});

// Action creators are generated for each case reducer function.
export const { setTitle, addTrack, removeTrack, getTempoAsync, setId, addTracksToPlaylistAsync } = builderSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectTitle, selectId, selectPlaylistTracks, selectStatus } = builderSlice.selectors;
