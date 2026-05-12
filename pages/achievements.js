/**
 * Achievements Page - View earned achievement badges (Mobile)
 */

import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { useSecretModes } from '../context/SecretModesContext';
import { loadFromCookie } from '../lib/cookieStorage';
import { useLanguage } from '../context/LanguageContext';

const ACHIEVEMENTS = {
  first_savings: {
    id: 'first_savings',
    title: 'First Steps',
    description: 'Have any savings',
    icon: '🌱',
    color: 'from-green-500 to-green-600',
  },
  first_1000: {
    id: 'first_1000',
    title: 'Saver',
    description: 'Save 1000+',
    icon: '💰',
    color: 'from-blue-500 to-blue-600',
  },
  first_5000: {
    id: 'first_5000',
    title: 'Big Spender',
    description: 'Save 5000+',
    icon: '🏆',
    color: 'from-purple-500 to-purple-600',
  },
  balanced_budget: {
    id: 'balanced_budget',
    title: 'Balanced',
    description: 'Income > Expenses',
    icon: '⚖️',
    color: 'from-pink-500 to-pink-600',
  },
  great_savings_rate: {
    id: 'great_savings_rate',
    title: 'Disciplined',
    description: 'Save 30%+ of income',
    icon: '📈',
    color: 'from-orange-500 to-orange-600',
  },
  no_debt: {
    id: 'no_debt',
    title: 'Clean Record',
    description: 'All expenses covered',
    icon: '✨',
    color: 'from-yellow-500 to-yellow-600',
  },
  roasted_100x: {
    id: 'roasted_100x',
    title: 'Get Roasted 100x',
    description: 'Get roasted 100 times',
    icon: '🔥',
    color: 'from-red-500 to-red-600',
  },
  overspender: {
    id: 'overspender',
    title: 'Overspender',
    description: 'Spend more than you earn',
    icon: '💸',
    color: 'from-red-500 to-pink-600',
  },
  all_spent: {
    id: 'all_spent',
    title: 'All Spent',
    description: 'Spend everything, save nothing',
    icon: '💰',
    color: 'from-amber-500 to-orange-600',
  },
  millionaire: {
    id: 'millionaire',
    title: 'Millionaire',
    description: 'Reach 1,000,000 in projected balance',
    icon: '💎',
    color: 'from-blue-500 to-purple-600',
  },
  secret_discoverer: {
    id: 'secret_discoverer',
    title: 'Secret Discoverer',
    description: 'Find the secret menu',
    icon: '🔓',
    color: 'from-indigo-500 to-purple-600',
  },
  car_enthusiast: {
    id: 'car_enthusiast',
    title: 'Car Enthusiast',
    description: 'Spend more on car than house',
    icon: '🚗',
    color: 'from-red-500 to-orange-600',
  },
  turkish_speaker: {
    id: 'turkish_speaker',
    title: 'Turkish Speaker',
    description: 'Use the app in Turkish',
    icon: '�',
    color: 'from-blue-500 to-cyan-600',
  },  lucky_420: {
    id: 'lucky_420',
    title: 'Lucky Number',
    description: 'Have a net leftover of exactly 420',
    icon: '🍀',
    color: 'from-green-500 to-emerald-600',
  },
  fresh_start: {
    id: 'fresh_start',
    title: 'Fresh Start',
    description: 'Reset all data once',
    icon: '🔄',
    color: 'from-purple-500 to-pink-600',
  },
};

export default function Achievements() {
  const { achievementMode, showAchievementsText, roastCount } = useSecretModes();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  // Load achievements from cookies
  useEffect(() => {
    const saved = loadFromCookie('unlocked_achievements') || [];
    setUnlockedAchievements(saved);
    setIsLoading(false);
  }, []);

  if (!showAchievementsText) {
    return (
      <div className="md:hidden min-h-screen bg-white pb-32 flex items-center justify-center">
        <div className="text-center px-4">
          <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Achievements Disabled</h2>
          <p className="text-gray-600 dark:text-gray-400">Enable Show Achievements in settings to view badges.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="md:hidden min-h-screen bg-white pb-32" />;
  }

  return (
    <div className="md:hidden min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={36} className="text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">Achievements</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {unlockedAchievements.length} of {Object.keys(ACHIEVEMENTS).length} badges earned
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
        {/* Earned Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">🎖️ Earned Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {unlockedAchievements.map((id) => {
                const achievementKey = Object.keys(ACHIEVEMENTS).find((key) => ACHIEVEMENTS[key].id === id);
                const achievement = achievementKey ? ACHIEVEMENTS[achievementKey] : null;
                return achievement ? (
                  <div
                    key={id}
                    className={`bg-gradient-to-br ${achievement.color} p-6 rounded-xl shadow-lg text-white flex flex-col items-center text-center hover:shadow-xl transition-shadow`}
                  >
                    <span className="text-5xl mb-3">{achievement.icon}</span>
                    <p className="font-bold text-lg">{achievement.title}</p>
                    <p className="text-sm opacity-90 mt-1">{achievement.description}</p>
                    {id === 'roasted_100x' && (
                      <p className="text-sm opacity-90 mt-2 font-semibold">🔥 {roastCount}/100</p>
                    )}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">🔒 Locked Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.values(ACHIEVEMENTS).map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              if (isUnlocked) return null;
              return (
                <div
                  key={achievement.id}
                  className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow opacity-50 flex flex-col items-center text-center"
                >
                  <span className="text-5xl mb-3 grayscale">{achievement.icon}</span>
                  {achievementMode && (
                    <>
                      <p className="font-bold text-lg text-gray-600 dark:text-gray-400">{achievement.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{achievement.description}</p>
                      {achievement.id === 'roasted_100x' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-semibold">🔥 {roastCount}/100</p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {unlockedAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Badges Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Start tracking your finances to earn achievement badges! Complete your first savings goal, balance your budget, and more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
