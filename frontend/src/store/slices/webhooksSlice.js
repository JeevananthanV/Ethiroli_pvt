import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subscriptions: [],
  loading: false,
  error: null
};

const webhooksSlice = createSlice({
  name: 'webhooks',
  initialState,
  reducers: {
    fetchWebhooksStart: (state) => { state.loading = true; },
    fetchWebhooksSuccess: (state, action) => { state.subscriptions = action.payload; state.loading = false; }
  }
});

export const { fetchWebhooksStart, fetchWebhooksSuccess } = webhooksSlice.actions;
export default webhooksSlice.reducer;
