import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    fetchClientsStart: (state) => { state.loading = true; },
    fetchClientsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchClientsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchClientsStart, fetchClientsSuccess, fetchClientsFailure } = clientsSlice.actions;
export default clientsSlice.reducer;
