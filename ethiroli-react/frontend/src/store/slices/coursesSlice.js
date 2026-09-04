import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart: (state) => { state.loading = true; },
    fetchCoursesSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchCoursesFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchCoursesStart, fetchCoursesSuccess, fetchCoursesFailure } = coursesSlice.actions;
export default coursesSlice.reducer;
