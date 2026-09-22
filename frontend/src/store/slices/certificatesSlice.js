import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {
    fetchCertificatesStart: (state) => { state.loading = true; },
    fetchCertificatesSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchCertificatesFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchCertificatesStart, fetchCertificatesSuccess, fetchCertificatesFailure } = certificatesSlice.actions;
export default certificatesSlice.reducer;
