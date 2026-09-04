import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  devices: [],
  loading: false,
  error: null
};

const pushNotificationsSlice = createSlice({
  name: 'pushNotifications',
  initialState,
  reducers: {
    fetchDevicesStart: (state) => { state.loading = true; },
    fetchDevicesSuccess: (state, action) => { state.devices = action.payload; state.loading = false; }
  }
});

export const { fetchDevicesStart, fetchDevicesSuccess } = pushNotificationsSlice.actions;
export default pushNotificationsSlice.reducer;
