import { createSlice } from '@reduxjs/toolkit';

// Below this width .portalSidebar becomes a fixed off-canvas drawer
// (see the max-width: 768px block in styles/admin.css). Starting it open
// covered the entire page with the drawer plus its dimming backdrop on load,
// so narrow viewports get the closed default instead. The threshold matches
// that media query on purpose: between 768px and 992px the sidebar is still an
// inline flex column, and hiding it there would leave no navigation at all.
const isDrawerViewport = typeof window !== 'undefined' && window.innerWidth < 768;

const initialState = {
  theme: localStorage.getItem('et_theme') || 'dark',
  sidebarOpen: !isDrawerViewport
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
