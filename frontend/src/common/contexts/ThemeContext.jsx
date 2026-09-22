/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { toggleTheme } from '../../store/slices/uiSlice.js';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state?.ui?.theme) || 'dark';

  useEffect(() => {
    // Add theme class to body/html
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
