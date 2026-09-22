import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => { state.loading = true; },
    fetchProductsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchProductsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } = productsSlice.actions;
export default productsSlice.reducer;
