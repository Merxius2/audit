import { createContext, useContext, useState, useEffect } from 'react';
import { saveToCookie, loadFromCookie } from '../lib/cookieStorage';

const SecretModesContext = createContext();

export function SecretModesProvider({ children }) {
  const [confettiMode, setConfettiMode] = useState(false);
  const [darkSoulMode, setDarkSoulMode] = useState(false);
  const [roastMode, setRoastMode] = useState(false);
  const [achievementMode, setAchievementMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load from cookies on mount
  useEffect(() => {
    const savedConfetti = loadFromCookie('secret_confetti_mode');
    const savedDarkSoul = loadFromCookie('secret_darksoul_mode');
    const savedRoast = loadFromCookie('secret_roast_mode');
    const savedAchievement = loadFromCookie('secret_achievement_mode');

    if (savedConfetti !== null) setConfettiMode(savedConfetti === 'true');
    if (savedDarkSoul !== null) setDarkSoulMode(savedDarkSoul === 'true');
    if (savedRoast !== null) setRoastMode(savedRoast === 'true');
    if (savedAchievement !== null) setAchievementMode(savedAchievement === 'true');
    setIsLoading(false);
  }, []);

  const toggleConfetti = () => {
    const newValue = !confettiMode;
    setConfettiMode(newValue);
    saveToCookie('secret_confetti_mode', newValue, 365);
  };

  const toggleDarkSoul = () => {
    const newValue = !darkSoulMode;
    setDarkSoulMode(newValue);
    saveToCookie('secret_darksoul_mode', newValue, 365);
  };

  const toggleRoast = () => {
    const newValue = !roastMode;
    setRoastMode(newValue);
    saveToCookie('secret_roast_mode', newValue, 365);
  };

  const toggleAchievement = () => {
    const newValue = !achievementMode;
    setAchievementMode(newValue);
    saveToCookie('secret_achievement_mode', newValue, 365);
  };

  return (
    <SecretModesContext.Provider
      value={{
        confettiMode,
        darkSoulMode,
        roastMode,
        achievementMode,
        toggleConfetti,
        toggleDarkSoul,
        toggleRoast,
        toggleAchievement,
        isLoading,
      }}
    >
      {children}
    </SecretModesContext.Provider>
  );
}

export function useSecretModes() {
  return useContext(SecretModesContext);
}
