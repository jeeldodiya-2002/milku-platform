import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWeather } from './WeatherContext';
import { MASTER_CONFIG } from '../masterConfig';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { temp } = useWeather();
  const [theme, setTheme] = useState(MASTER_CONFIG.THEMES[1].styles); // Default to Mild

  useEffect(() => {
    // Find the theme that matches current temperature range
    const activeTheme = MASTER_CONFIG.THEMES.find(t => temp >= t.range[0] && temp <= t.range[1]) || MASTER_CONFIG.THEMES[1];
    
    setTheme(activeTheme.styles);
    
    // Apply CSS variables to document root for global styling
    const root = document.documentElement;
    Object.entries(activeTheme.styles).forEach(([key, value]) => {
      if (key !== 'intensity' && key !== 'particleColor') {
        // Handle gradients or solid colors
        root.style.setProperty(`--milku-${key}`, value);
      }
    });
    
    // Special case for background if it's a gradient
    if (activeTheme.styles.background) {
      root.style.setProperty('--milku-bg-main', activeTheme.styles.background);
    }

  }, [temp]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
