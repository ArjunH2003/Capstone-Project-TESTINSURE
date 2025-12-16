import { createContext, useState, useEffect } from 'react';

// Create the Context
export const ThemeContext = createContext();

// Create the Provider Component
export const ThemeProvider = ({ children }) => {
  
  // 1. Initialize State (Check LocalStorage first)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme === 'dark';
  });

  // 2. Define the Color Palettes
  const theme = {
    isDark: isDarkMode,
    colors: isDarkMode ? {
      // DARK MODE COLORS
      bg: '#0f172a',        // Deep Navy Background
      card: '#1e293b',      // Slate for Cards/Navbar
      text: '#f8fafc',      // White Text
      textMuted: '#94a3b8', // Light Grey Text
      border: '#334155',    // Dark Border
      primary: '#3b82f6',   // Bright Blue
    } : {
      // LIGHT MODE COLORS
      bg: '#f0f4f8',        // Pale Blue/Grey Background
      card: '#ffffff',      // White Cards/Navbar
      text: '#212529',      // Dark Grey Text
      textMuted: '#6c757d', // Muted Text
      border: '#e2e8f0',    // Light Border
      primary: '#0d6efd',   // Standard Blue
    }
  };

  // 3. Toggle Function
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // 4. Side Effect: Update LocalStorage & HTML Attribute
  useEffect(() => {
    const mode = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('appTheme', mode);
    
    // This allows Bootstrap to automatically switch its internal dark mode too
    document.documentElement.setAttribute('data-bs-theme', mode);
  }, [isDarkMode]);

  // 5. Return Provider
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};