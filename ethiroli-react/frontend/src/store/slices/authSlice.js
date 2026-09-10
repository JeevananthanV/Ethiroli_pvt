import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  socketToken: null,
  tenantId: null,
  tenantRole: null,
  activePortal: null
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
      state.activePortal = action.payload.activePortal || null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.socketToken = null;
      state.tenantId = null;
      state.tenantRole = null;
      state.activePortal = null;
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectSocketToken = (state) => state.auth.socketToken;

export default authSlice.reducer;
