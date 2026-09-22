import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    fetchCandidatesStart: (state) => { state.loading = true; },
    fetchCandidatesSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchCandidatesFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchCandidatesStart, fetchCandidatesSuccess, fetchCandidatesFailure } = candidatesSlice.actions;
export default candidatesSlice.reducer;
