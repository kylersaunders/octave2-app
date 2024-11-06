import { RecommendationInputFormValues } from '@/app/components/filters/components/FiltersForm';
import { createAppSlice } from '@/lib/createAppSlice';
import { PayloadAction } from '@reduxjs/toolkit';

const initialState: RecommendationInputFormValues = {
  targetDanceability: '0.5',
  limit: '100',
};

export const filtersSlice = createAppSlice({
  name: 'filters',
  initialState,
  reducers: (create) => ({
    setLimit: create.reducer((state, action: PayloadAction<string>) => {
      state.limit = action.payload;
    }),
    setMarket: create.reducer((state, action: PayloadAction<string>) => {
      state.market = action.payload;
    }),
    setTargetDanceability: create.reducer((state, action: PayloadAction<string>) => {
      state.targetDanceability = action.payload;
    }),
    setMinDuration: create.reducer((state, action: PayloadAction<string>) => {
      state.minDuration = action.payload;
    }),
    setTargetDuration: create.reducer((state, action: PayloadAction<string>) => {
      state.targetDuration = action.payload;
    }),
    setMaxDuration: create.reducer((state, action: PayloadAction<string>) => {
      state.maxDuration = action.payload;
    }),
    setTargetEnergy: create.reducer((state, action: PayloadAction<string>) => {
      state.targetEnergy = action.payload;
    }),
    setMinSpm: create.reducer((state, action: PayloadAction<string>) => {
      state.minSpm = action.payload;
    }),
    setTargetSpm: create.reducer((state, action: PayloadAction<string>) => {
      state.targetSpm = action.payload;
    }),
    setMaxSpm: create.reducer((state, action: PayloadAction<string>) => {
      state.maxSpm = action.payload;
    }),
    setMinTempo: create.reducer((state, action: PayloadAction<string>) => {
      state.minTempo = action.payload;
    }),
    setTargetTempo: create.reducer((state, action: PayloadAction<string>) => {
      state.targetTempo = action.payload;
    }),
    setMaxTempo: create.reducer((state, action: PayloadAction<string>) => {
      state.maxTempo = action.payload;
    }),
  }),
  selectors: {
    selectFilters: (state) => state,
  },
});

export const {
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
} = filtersSlice.actions;
export const { selectFilters } = filtersSlice.selectors;
