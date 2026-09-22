import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    fetchAttendanceStart: (state) => { state.loading = true; },
    fetchAttendanceSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchAttendanceFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchAttendanceStart, fetchAttendanceSuccess, fetchAttendanceFailure } = attendanceSlice.actions;
export default attendanceSlice.reducer;
