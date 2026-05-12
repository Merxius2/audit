import { createContext, useContext, useState, useEffect } from 'react';
import { saveToCookie, loadFromCookie } from '../lib/cookieStorage';

const SecretSettingsContext = createContext();

export function SecretSettingsProvider({ children }) {
  const [isSecretSettingsOpen, setIsSecretSettingsOpen] = useState(false);
  const [secretSettingsDiscovered, setSecretSettingsDiscovered] = useState(false);

  // Load secret settings discovery status from cookies on mount
  useEffect(() => {
    const saved = loadFromCookie('secret_settings_discovered');
    if (saved === 'true') {
      setSecretSettingsDiscovered(true);
    }
  }, []);

  const openSecretSettings = () => {
    setIsSecretSettingsOpen(true);
    // Mark as discovered when opened
    if (!secretSettingsDiscovered) {
      setSecretSettingsDiscovered(true);
      saveToCookie('secret_settings_discovered', 'true', 365);
    }
  };

  const closeSecretSettings = () => {
    setIsSecretSettingsOpen(false);
  };

  return (
    <SecretSettingsContext.Provider value={{ isSecretSettingsOpen, openSecretSettings, closeSecretSettings, secretSettingsDiscovered }}>
      {children}
    </SecretSettingsContext.Provider>
  );
}

export function useSecretSettings() {
  return useContext(SecretSettingsContext);
}
