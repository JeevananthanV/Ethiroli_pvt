import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const leavesSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    fetchLeavesStart: (state) => { state.loading = true; },
    fetchLeavesSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchLeavesFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchLeavesStart, fetchLeavesSuccess, fetchLeavesFailure } = leavesSlice.actions;
export default leavesSlice.reducer;
