import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  loading: false,
  error: null
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    fetchEventsStart: (state) => { state.loading = true; },
    fetchEventsSuccess: (state, action) => { state.events = action.payload; state.loading = false; },
    fetchEventsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchEventsStart, fetchEventsSuccess, fetchEventsFailure } = calendarSlice.actions;
export default calendarSlice.reducer;
