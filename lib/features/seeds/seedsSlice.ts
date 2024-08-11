// import { createAppSlice } from '@/lib/createAppSlice';
// import type { PayloadAction } from '@reduxjs/toolkit';
// import { TrackPlus } from '../builder/builderSlice';
// import { SEEDS_IDLE_PHRASE, SEEDS_MAX_PHRASE } from '@/lib/constants';
// import { RecommendationInputFormValues } from '@/app/components/recommendations/components/advanced-search/components/recommendation-inputs';

// export interface SeedsSliceState {
//   seeds: TrackPlus[];
//   status: typeof SEEDS_IDLE_PHRASE | typeof SEEDS_MAX_PHRASE;
//   filters: RecommendationInputFormValues;
// }

// const initialState: SeedsSliceState = {
//   status: 'idle',
//   filters: {
//     seedGenres: [],
//     seedArtists: [],
//     seedTracks: ['12jmCJskrYkrEEy6rUlQ0W'],
//   },
// };

// export const seedsSlice = createAppSlice({
//   name: 'seeds',
//   initialState,
//   reducers: (create) => ({
//     addSeed: create.reducer((state, action: PayloadAction<TrackPlus>) => {
//       // show error if more than 5 seeds
//       if (state.seeds.length >= 5) {
//         state.status = SEEDS_MAX_PHRASE;
//       } else {
//         const temp = new Set(state.seeds.map((seed) => seed.id));
//         if (!temp.has(action.payload.id)) {
//           state.seeds.push(action.payload);
//         }
//       }
//     }),
//     removeSeed: create.reducer((state, action: PayloadAction<string>) => {
//       state.seeds = state.seeds.filter((seed) => seed.id !== action.payload);
//     }),
//     clearSeeds: create.reducer((state) => {
//       state.seeds = [];
//     }),
//     setSeedGenres: create.reducer((state, action: PayloadAction<string[]>) => {
//       state.filters.seedGenres = action.payload;
//     }),
//     setSeedArtists: create.reducer((state, action: PayloadAction<string[]>) => {
//       state.filters.seedArtists = action.payload;
//     }),
//     setLimit: create.reducer((state, action: PayloadAction<string>) => {
//       state.filters.limit = action.payload;
//     }),
//     setMarket: create.reducer((state, action: PayloadAction<string>) => {
//       state.filters.market = action.payload;
//     }),
//     setTargetDanceability: create.reducer((state, action: PayloadAction<string>) => {
//       console.log('setTargetDanceability', action.payload);
//       state.filters.targetDanceability = action.payload;
//     }),
//     setMinDuration: create.reducer((state, action: PayloadAction<string>) => {
//       state.filters.minDuration = action.payload;
//     }),
//     setTargetDuration: create.reducer((state, action: PayloadAction<string>) => {
//       state.filters.targetDuration = action.payload;
//     }),
//     setMaxDuration: create.reducer((state, action: PayloadAction<string>) => {
//       state.filters.maxDuration = action.payload;
//     }),
//     setTargetEnergy: create.reducer((state, action: PayloadAction<string>) => {
//       state.filters.targetEnergy = action.payload;
//     }),
//     setMinTempo: create.reducer((state, action: PayloadAction<string>) => {
//       state.filters.minTempo = action.payload;
//     }),
//     setTargetTempo: create.reducer((state, action: PayloadAction<string>) => {
//       state.filters.targetTempo = action.payload;
//     }),
//     setMaxTempo: create.reducer((state, action: PayloadAction<string>) => {
//       state.filters.maxTempo = action.payload;
//     }),
//   }),
//   selectors: {
//     selectSeeds: (state) => state.seeds,
//     selectSeedsStatus: (state) => state.status,
//     selectSearchFilters: (state) => state.filters,
//   },
// });

// export const {
//   addSeed,
//   removeSeed,
//   clearSeeds,
//   setSeedGenres,
//   setSeedArtists,
//   setLimit,
//   setMarket,
//   setTargetDanceability,
//   setMinDuration,
//   setTargetDuration,
//   setMaxDuration,
//   setTargetEnergy,
//   setMinTempo,
//   setTargetTempo,
//   setMaxTempo,
// } = seedsSlice.actions;
// export const { selectSeeds, selectSeedsStatus, selectSearchFilters } = seedsSlice.selectors;
