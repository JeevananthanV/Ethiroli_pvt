import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  keys: [],
  loading: false,
  error: null
};

const apiKeysSlice = createSlice({
  name: 'apiKeys',
  initialState,
  reducers: {
    fetchKeysStart: (state) => { state.loading = true; },
    fetchKeysSuccess: (state, action) => { state.keys = action.payload; state.loading = false; }
  }
});

export const { fetchKeysStart, fetchKeysSuccess } = apiKeysSlice.actions;
export default apiKeysSlice.reducer;
