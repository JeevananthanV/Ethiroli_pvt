import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersStart: (state) => { state.loading = true; },
    fetchOrdersSuccess: (state, action) => { state.items = action.payload; state.loading = false; }
  }
});

export const { fetchOrdersStart, fetchOrdersSuccess } = ordersSlice.actions;
export default ordersSlice.reducer;
