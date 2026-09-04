import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    fetchFeedStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFeedSuccess: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(item => !item.is_read).length;
      state.loading = false;
    },
    fetchFeedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addFeedItem: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markFeedItemRead: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1 && !state.items[index].is_read) {
        state.items[index].is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    }
  }
});

export const {
  fetchFeedStart,
  fetchFeedSuccess,
  fetchFeedFailure,
  addFeedItem,
  markFeedItemRead
} = feedSlice.actions;

export default feedSlice.reducer;
