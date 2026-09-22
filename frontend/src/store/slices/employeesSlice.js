import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    fetchEmployeesStart: (state) => { state.loading = true; },
    fetchEmployeesSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchEmployeesFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchEmployeesStart, fetchEmployeesSuccess, fetchEmployeesFailure } = employeesSlice.actions;
export default employeesSlice.reducer;
