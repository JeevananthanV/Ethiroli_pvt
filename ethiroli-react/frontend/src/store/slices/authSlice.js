import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  socketToken: null,
  tenantId: null,
  tenantRole: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.socketToken = action.payload.socket_token || null;
      state.tenantId = action.payload.user?.tenant_id || null;
      state.tenantRole = action.payload.user?.tenant_role || null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.socketToken = null;
      state.tenantId = null;
      state.tenantRole = null;
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
