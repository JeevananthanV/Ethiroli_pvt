import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    fetchLeadsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLeadsSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchLeadsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addLead: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateLeadItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    removeLeadItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

export const {
  fetchLeadsStart,
  fetchLeadsSuccess,
  fetchLeadsFailure,
  addLead,
  updateLeadItem,
  removeLeadItem
} = leadsSlice.actions;

export default leadsSlice.reducer;
