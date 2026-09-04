import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addUserItem: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateUserItemInSlice: (state, action) => {
      const index = state.items.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    removeUserItemFromSlice: (state, action) => {
      state.items = state.items.filter(user => user.id !== action.payload);
    }
  }
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  addUserItem,
  updateUserItemInSlice,
  removeUserItemFromSlice
} = usersSlice.actions;

export default usersSlice.reducer;
