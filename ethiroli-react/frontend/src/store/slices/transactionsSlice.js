import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => { state.loading = true; },
    fetchTransactionsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchTransactionsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchTransactionsStart, fetchTransactionsSuccess, fetchTransactionsFailure } = transactionsSlice.actions;
export default transactionsSlice.reducer;
