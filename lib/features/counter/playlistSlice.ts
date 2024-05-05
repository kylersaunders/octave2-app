import { createAppSlice } from '@/lib/createAppSlice';
import type { AppThunk } from '@/lib/store';
import type { PayloadAction } from '@reduxjs/toolkit';
// import { fetchCount } from './counterAPI';
import { addTracksToPlaylist, createPlaylist, getTempo } from '@/actions/tracks';
import { Track } from '@/types/tracks';

export interface TrackPlus extends Track {
  tempo?: number;
}

export interface CounterSliceState {
  id: string;
  title: string;
  tracks: TrackPlus[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterSliceState = {
  id: '',
  title: 'bot_playlist2',
  tracks: [],
  status: 'idle',
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const counterSlice = createAppSlice({
  name: 'counter',
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
        const response = await getTempo(track.id);
        const tempo = await response.json();
        return tempo;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'idle';
          state.tracks = state.tracks.map((track: TrackPlus) => {
            if (track.id === action.meta.arg.id) {
              track.tempo = action.payload;
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
    // createPlaylistAsync: create.asyncThunk(
    //   async (playlistName: string) => {
    //     const response = await createPlaylist({ playlistName });
    //     return response;
    //   },
    //   {
    //     pending: (state) => {
    //       state.status = 'loading';
    //     },
    //     fulfilled: (state, action) => {
    //       state.status = 'idle';
    //       console.log('payload', action.payload);
    //       state.id = action.payload;
    //     },
    //     rejected: (state) => {
    //       state.status = 'failed';
    //     },
    //   }
    // ),
    addTracksToPlaylistAsync: create.asyncThunk(
      async ({ playlistId, trackIdList }: { playlistId: string; trackIdList: string[] }) => {
        const response = await addTracksToPlaylist({ playlistId, trackIdList });
        return response.data;
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
    // increment: create.reducer((state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // }),
    // decrement: create.reducer((state) => {
    //   state.value -= 1;
    // }),
    // // Use the `PayloadAction` type to declare the contents of `action.payload`
    // incrementByAmount: create.reducer((state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // }),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    // incrementAsync: create.asyncThunk(
    //   async (amount: number) => {
    //     const response = await fetchCount(amount);
    //     // The value we return becomes the `fulfilled` action payload
    //     return response.data;
    //   },
    //   {
    //     pending: (state) => {
    //       state.status = 'loading';
    //     },
    //     fulfilled: (state, action) => {
    //       state.status = 'idle';
    //       state.value += action.payload;
    //     },
    //     rejected: (state) => {
    //       state.status = 'failed';
    //     },
    //   }
    // ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectTitle: (counter) => counter.title,
    selectId: (counter) => counter.id,
    selectRecs: (counter) => counter.tracks,
    selectStatus: (counter) => counter.status,
  },
});

// Action creators are generated for each case reducer function.
export const { setTitle, addTrack, removeTrack, getTempoAsync, setId, addTracksToPlaylistAsync } = counterSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectTitle, selectId, selectRecs, selectStatus } = counterSlice.selectors;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());

//     if (currentValue % 2 === 1 || currentValue % 2 === -1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

// export const buildPlaylist = (): AppThunk => async (dispatch, getState) => {
//   console.log('buildPlaylist');
//   const state = getState();
//   const title = selectTitle(state);
//   const tracks = selectTracks(state);
//   const playlistId = selectId(state);

//   dispatch(createPlaylistAsync(title));
//   console.log('title', title);
//   console.log('playlistId', playlistId);
//   dispatch(addTracksToPlaylistAsync({ playlistId, trackIdList: tracks.map((x: TrackPlus) => x.id) }));
// };
