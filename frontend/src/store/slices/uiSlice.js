import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('et_theme') || 'dark',
  sidebarOpen: true
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = nextTheme;
      localStorage.setItem('et_theme', nextTheme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    }
  }
});

export const { toggleTheme, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
