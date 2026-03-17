import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    // Check local storage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Density state
  const [density, setDensityState] = useState(() => {
    return localStorage.getItem('density') || 'comfortable';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setDensity = (newDensity) => {
    setDensityState(newDensity);
    localStorage.setItem('density', newDensity);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, density, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
