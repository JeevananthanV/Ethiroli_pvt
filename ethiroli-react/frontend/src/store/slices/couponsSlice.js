import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    fetchCouponsStart: (state) => { state.loading = true; },
    fetchCouponsSuccess: (state, action) => { state.items = action.payload; state.loading = false; }
  }
});

export const { fetchCouponsStart, fetchCouponsSuccess } = couponsSlice.actions;
export default couponsSlice.reducer;
