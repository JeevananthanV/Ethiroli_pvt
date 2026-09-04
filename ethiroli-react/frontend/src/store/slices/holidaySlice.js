import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const holidaySlice = createSlice({
  name: 'holiday',
  initialState,
  reducers: {
    fetchHolidaysStart: (state) => { state.loading = true; },
    fetchHolidaysSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchHolidaysFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchHolidaysStart, fetchHolidaysSuccess, fetchHolidaysFailure } = holidaySlice.actions;
export default holidaySlice.reducer;
