import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  available: [],
  earned: [],
  loading: false,
  error: null
};

const badgesSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    fetchBadgesStart: (state) => { state.loading = true; },
    fetchBadgesSuccess: (state, action) => { state.available = action.payload; state.loading = false; },
    fetchBadgesFailure: (state, action) => { state.error = action.payload; state.loading = false; },
    fetchEarnedBadgesSuccess: (state, action) => { state.earned = action.payload; }
  }
});

export const { fetchBadgesStart, fetchBadgesSuccess, fetchBadgesFailure, fetchEarnedBadgesSuccess } = badgesSlice.actions;
export default badgesSlice.reducer;
