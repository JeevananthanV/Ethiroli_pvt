import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scores: {},
  loading: false,
  error: null
};

const predictiveSlice = createSlice({
  name: 'predictive',
  initialState,
  reducers: {
    fetchScoresStart: (state) => { state.loading = true; },
    fetchScoresSuccess: (state, action) => { state.scores = action.payload; state.loading = false; }
  }
});

export const { fetchScoresStart, fetchScoresSuccess } = predictiveSlice.actions;
export default predictiveSlice.reducer;
