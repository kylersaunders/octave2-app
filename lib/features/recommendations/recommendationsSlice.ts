import { createAppSlice } from '@/lib/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TrackPlus } from '../builder/builderSlice';
import { RecommendationsData, Seed } from '@/types/tracks';
import { SeedStatus, Status } from '@/types/common';
import { RecommendationInputFormValues } from '@/app/components/recommendations/components/advanced-search/components/recommendation-inputs';

// bring in all except seedTracksState, seedGenresState, seedArtistsState
export interface SearchSliceFiltersState extends Omit<RecommendationInputFormValues, 'seedTracksState' & 'seedGenresState'> {
  seedTracks?: string[];
  seedGenres?: string[];
  seedArtists?: string[];
}

export interface SearchSliceState {
  tracks: Array<TrackPlus | RecommendationsData | null>;
  searchTerm?: string;
  status: Status;
  selectedUrl: string;
  filters: SearchSliceFiltersState;
  seedTracksStatus: SeedStatus;
}

const initialState: SearchSliceState = {
  tracks: [],
  searchTerm: '',
  status: Status.IDLE,
  selectedUrl: '',
  filters: {
    seedGenresState: [],
    seedArtistsState: [],
    seedTracksState: [],
    targetDanceability: '0.5',
    limit: '100',
  },
  seedTracksStatus: SeedStatus.IDLE,
};

export const recommendationsSlice = createAppSlice({
  name: 'searchRecommendationInputs',
  initialState,
  reducers: (create) => ({
    setTracks: create.reducer((state, action: PayloadAction<TrackPlus[]>) => {
      state.tracks = action.payload;
    }),
    addTempoToTrack: create.reducer((state, action: PayloadAction<{ id: string; tempo: number }>) => {
      const targetTrack = state.tracks?.find((track) => track?.id === action.payload.id);
      if (targetTrack) {
        targetTrack.tempo = action.payload.tempo;
      }
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
    setSelectedUrl: create.reducer((state, action: PayloadAction<string>) => {
      const selectedTrack = state.tracks.find((track) => track?.id === action.payload);
      if (state.selectedUrl === selectedTrack?.preview_url) {
        state.selectedUrl = '/';
      } else {
        state.selectedUrl = selectedTrack?.preview_url || '';
      }
    }),
    addSeed: create.reducer((state, action: PayloadAction<TrackPlus>) => {
      // show error if more than 5 seeds
      if (state.filters.seedTracksState?.length >= 5) {
        state.seedTracksStatus = SeedStatus.MAX;
      } else {
        const temp = new Set(state.filters.seedTracksState?.map((seed) => seed?.id));
        if (!temp.has(action.payload.id)) {
          state.filters.seedTracksState?.push(action.payload);
        }
      }
    }),
    removeSeed: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.seedTracksState = state.filters.seedTracksState?.filter((seed) => seed?.id !== action.payload);
    }),
    clearSeeds: create.reducer((state) => {
      state.filters.seedTracksState = [];
    }),
    setSeedGenresState: create.reducer((state, action: PayloadAction<{ [key: string]: any }[]>) => {
      state.filters.seedGenresState = action.payload;
    }),
    setSeedArtistsState: create.reducer((state, action: PayloadAction<{ [key: string]: any }[]>) => {
      state.filters.seedArtistsState = action.payload;
    }),
    setLimit: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.limit = action.payload;
    }),
    setMarket: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.market = action.payload;
    }),
    setTargetDanceability: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.targetDanceability = action.payload;
    }),
    setMinDuration: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.minDuration = action.payload;
    }),
    setTargetDuration: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.targetDuration = action.payload;
    }),
    setMaxDuration: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.maxDuration = action.payload;
    }),
    setTargetEnergy: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.targetEnergy = action.payload;
    }),
    setMinSpm: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.minSpm = action.payload;
    }),
    setTargetSpm: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.targetSpm = action.payload;
    }),
    setMaxSpm: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.maxSpm = action.payload;
    }),
    setMinTempo: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.minTempo = action.payload;
    }),
    setTargetTempo: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.targetTempo = action.payload;
    }),
    setMaxTempo: create.reducer((state, action: PayloadAction<string>) => {
      state.filters.maxTempo = action.payload;
    }),
  }),
  selectors: {
    selectSearchTracks: (state) => state.tracks,
    selectSearchTerm: (state) => state.searchTerm,
    selectSearchStatus: (state) => state.status,
    selectSelectedUrl: (state) => state.selectedUrl,
    selectSeeds: (state) => state.filters.seedTracksState,
    selectSeedsStatus: (state) => state.seedTracksStatus,
    selectSearchFilters: (state) => state.filters,
  },
});

export const {
  setTracks,
  addTempoToTrack,
  clearTracks,
  setSearchTerm,
  setRecStatus,
  setSelectedUrl,
  addSeed,
  removeSeed,
  clearSeeds,
  setSeedGenresState,
  setSeedArtistsState,
  setLimit,
  setMarket,
  setTargetDanceability,
  setMinDuration,
  setTargetDuration,
  setMaxDuration,
  setTargetEnergy,
  setMinSpm,
  setTargetSpm,
  setMaxSpm,
  setMinTempo,
  setTargetTempo,
  setMaxTempo,
} = recommendationsSlice.actions;
export const { selectSearchTracks, selectSearchTerm, selectSearchStatus, selectSelectedUrl, selectSeeds, selectSeedsStatus, selectSearchFilters } =
  recommendationsSlice.selectors;
