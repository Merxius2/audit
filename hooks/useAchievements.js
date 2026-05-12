import { useEffect, useState } from 'react';
import { useSecretModes } from '../context/SecretModesContext';
import { saveToCookie, loadFromCookie } from '../lib/cookieStorage';

const ACHIEVEMENTS = {
  first_savings: {
    id: 'first_savings',
    title: 'First Steps',
    description: 'Have any savings',
    icon: '🌱',
    condition: (data) => data.savingsAmount > 0,
  },
  first_1000: {
    id: 'first_1000',
    title: 'Saver',
    description: 'Save 1000+',
    icon: '💰',
    condition: (data) => data.savingsAmount >= 1000,
  },
  first_5000: {
    id: 'first_5000',
    title: 'Big Spender',
    description: 'Save 5000+',
    icon: '🏆',
    condition: (data) => data.savingsAmount >= 5000,
  },
  balanced_budget: {
    id: 'balanced_budget',
    title: 'Balanced',
    description: 'Income > Expenses',
    icon: '⚖️',
    condition: (data) => data.totalIncome > data.totalExpenses,
  },
  great_savings_rate: {
    id: 'great_savings_rate',
    title: 'Disciplined',
    description: 'Save 30%+ of income',
    icon: '📈',
    condition: (data) => {
      const savingsRate = (data.savingsAmount / data.totalIncome) * 100;
      return savingsRate >= 30;
    },
  },
  no_debt: {
    id: 'no_debt',
    title: 'Clean Record',
    description: 'All expenses covered',
    icon: '✨',
    condition: (data) => data.leftover >= 0,
  },
  roasted_100x: {
    id: 'roasted_100x',
    title: 'Get Roasted 100x',
    description: 'Get roasted 100 times',
    icon: '🔥',
    condition: (data) => data.roastCount >= 100,
  },
};

export function useAchievements(totalIncome, totalExpenses, savingsAmount, roastCount = 0) {
  const { achievementMode } = useSecretModes();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    if (!achievementMode) return;

    const data = {
      totalIncome: totalIncome || 0,
      totalExpenses: totalExpenses || 0,
      savingsAmount: savingsAmount || 0,
      leftover: (totalIncome || 0) - (totalExpenses || 0),
      roastCount: roastCount || 0,
    };

    // Load previously unlocked achievements
    const savedAchievements = loadFromCookie('unlocked_achievements') || [];

    const currentlyUnlocked = Object.values(ACHIEVEMENTS)
      .filter((achievement) => achievement.condition(data))
      .map((a) => a.id);

    // Find newly unlocked achievements
    const newly = currentlyUnlocked.filter((id) => !savedAchievements.includes(id));

    if (newly.length > 0) {
      setNewAchievements(
        newly.map((id) => ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find((key) => ACHIEVEMENTS[key].id === id)])
      );
      // Save updated achievements
      const updatedAchievements = [...new Set([...savedAchievements, ...newly])];
      saveToCookie('unlocked_achievements', updatedAchievements, 365);
    }

    setUnlockedAchievements(currentlyUnlocked);
  }, [totalIncome, totalExpenses, savingsAmount, roastCount, achievementMode]);

  return { unlockedAchievements, newAchievements };
}

export function AchievementNotification({ achievement }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg shadow-lg animate-bounce z-50">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{achievement.icon}</span>
        <div>
          <p className="font-bold">{achievement.title}</p>
          <p className="text-sm opacity-90">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}

export function AchievementsDisplay() {
  const { achievementMode } = useSecretModes();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  useEffect(() => {
    if (achievementMode) {
      const saved = loadFromCookie('unlocked_achievements') || [];
      setUnlockedAchievements(saved);
    }
  }, [achievementMode]);

  if (!achievementMode || unlockedAchievements.length === 0) return null;

  return (
    <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-3">🏆 Achievements ({unlockedAchievements.length})</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {unlockedAchievements.map((id) => {
          const achievementKey = Object.keys(ACHIEVEMENTS).find((key) => ACHIEVEMENTS[key].id === id);
          const achievement = achievementKey ? ACHIEVEMENTS[achievementKey] : null;
          return achievement ? (
            <div key={id} className="flex flex-col items-center text-center p-2 bg-white dark:bg-yellow-900/40 rounded-lg">
              <span className="text-2xl mb-1">{achievement.icon}</span>
              <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100">{achievement.title}</p>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
