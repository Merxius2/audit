import { createContext, useContext, useState, useEffect } from 'react';
import { saveToCookie, loadFromCookie } from '../lib/cookieStorage';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load dark mode preference from cookies on mount
  useEffect(() => {
    const savedDarkMode = loadFromCookie('dark_mode_preference');
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }
    setIsLoading(false);
  }, []);

  // Update the DOM when dark mode changes
  useEffect(() => {
    if (isLoading) return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, isLoading]);

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    saveToCookie('dark_mode_preference', newValue ? 'true' : 'false', 365);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, isLoading }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};
