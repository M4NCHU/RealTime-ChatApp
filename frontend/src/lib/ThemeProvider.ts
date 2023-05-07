import React, { useState, useEffect } from 'react';

interface ThemeState {
  theme: 'light' | 'dark';
}

const ThemeContext = React.createContext<ThemeState>({
  theme: 'light',
});

export const ThemeProvider: React.FC<ThemeState> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeState['theme']>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme as ThemeState['theme']);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};