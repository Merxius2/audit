/**
 * Desktop Sidebar Navigation Component
 * Displays logo, age bracket selector, and main navigation links
 */

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BarChart3, TrendingUp, Eye, Settings, Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSecretSettings } from '../context/SecretSettingsContext';
import { useSecretModes } from '../context/SecretModesContext';
import { loadFromCookie } from '../lib/cookieStorage';
import { useState, useRef, useEffect } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { openSecretSettings } = useSecretSettings();
  const { achievementMode, showAchievementsText, roastCount } = useSecretModes();
  const [clickCount, setClickCount] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const clickTimeout = useRef(null);

  const isActive = (path) => router.pathname === path;

  // Load achievements when showing achievements text
  useEffect(() => {
    if (showAchievementsText) {
      const saved = loadFromCookie('unlocked_achievements') || [];
      setUnlockedAchievements(saved);
    }
  }, [showAchievementsText]);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    
    if (clickCount + 1 === 3) {
      openSecretSettings();
      setClickCount(0);
    } else {
      clickTimeout.current = setTimeout(() => {
        setClickCount(0);
      }, 1000);
    }
  };

  const getLanguageIcon = (lang) => {
    const iconMap = {
      en: '/icon-e-192.png',
      nl: '/icon-n-192.png',
      ru: '/icon-r-192.png',
      tr: '/icon-t-192.png',
    };
    return iconMap[lang] || '/icon-e-192.png';
  };

  const navItems = [
    { path: '/overview', labelKey: 'navigation.overview', icon: Eye },
    { path: '/dashboard', labelKey: 'navigation.householdBudget', icon: BarChart3 },
    { path: '/retirement', labelKey: 'navigation.retirement', icon: TrendingUp },
    { path: '/settings', labelKey: 'navigation.settings', icon: Settings },
  ];

  return (
    <div className="hidden md:fixed md:left-0 md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white md:p-6 md:shadow-soft dark:border-gray-800 dark:bg-gray-900">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex flex-col items-center gap-3 mb-2">
          <button
            onClick={handleLogoClick}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title={clickCount > 0 ? `${3 - clickCount} clicks left to unlock secret settings` : ''}
          >
            <Image src={getLanguageIcon(language)} alt="Audit Logo" width={80} height={80} className="rounded-lg" />
          </button>
          <h1 className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-3xl font-bold text-transparent text-center">
            Aap-FT
          </h1>
        </div>
        <p className="mt-1 text-xs font-medium text-gray-500 text-center">Financial Tools</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-gray-100 text-brand-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{t(item.labelKey)}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Achievements Section */}
      {showAchievementsText && (
        <div className="mb-6 border-b border-gray-200 pb-6 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Badges</span>
            </div>
            <span className="text-xs font-bold bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
              {unlockedAchievements.length}/14
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'first_savings', emoji: '🌱', title: 'First Steps', desc: 'Have any savings' },
              { id: 'first_1000', emoji: '💰', title: 'Saver', desc: 'Save 1000+' },
              { id: 'first_5000', emoji: '🏆', title: 'Big Spender', desc: 'Save 5000+' },
              { id: 'balanced_budget', emoji: '⚖️', title: 'Balanced', desc: 'Income > Expenses' },
              { id: 'great_savings_rate', emoji: '📈', title: 'Disciplined', desc: 'Save 30%+ of income' },
              { id: 'no_debt', emoji: '✨', title: 'Clean Record', desc: 'All expenses covered' },
              { id: 'roasted_100x', emoji: '🔥', title: 'Get Roasted 100x', desc: 'Get roasted 100 times' },
              { id: 'overspender', emoji: '💸', title: 'Overspender', desc: 'Spend more than you earn' },
              { id: 'all_spent', emoji: '💰', title: 'All Spent', desc: 'Spend everything, save nothing' },
              { id: 'millionaire', emoji: '💎', title: 'Millionaire', desc: 'Reach 1,000,000 balance' },
              { id: 'secret_discoverer', emoji: '🔓', title: 'Secret Discoverer', desc: 'Find the secret menu' },
              { id: 'car_enthusiast', emoji: '🚗', title: 'Car Enthusiast', desc: 'Spend more on car than house' },
              { id: 'turkish_speaker', emoji: '🌍', title: 'Turkish Speaker', desc: 'Use the app in Turkish' },
              { id: 'lucky_420', emoji: '🍀', title: 'Lucky Number', desc: 'Have a net leftover of exactly 420' },
            ].map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              const canShowText = isUnlocked || achievementMode;
              
              return (
                <div
                  key={achievement.id}
                  className={`relative group flex items-center justify-center w-full aspect-square rounded-lg text-xl transition-colors ${
                    isUnlocked
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
                      : 'bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isUnlocked ? achievement.emoji : <span className="opacity-30">{achievement.emoji}</span>}
                  
                  {/* Tooltip - only show text if unlocked or achievement mode is active */}
                  {canShowText && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-32 z-50">
                      <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded py-2 px-2 whitespace-normal">
                        <p className="font-semibold">{achievement.title}</p>
                        <p className="opacity-90">{achievement.desc}</p>
                        {achievement.id === 'roasted_100x' && (
                          <p className="text-orange-300 mt-1">🔥 {roastCount}/100</p>
                        )}
                        {!isUnlocked && achievement.id !== 'roasted_100x' && <p className="text-yellow-300 mt-1">🔒 Locked</p>}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <p>© 2026 Aap Financial Tools</p>
      </div>
    </div>
  );
}

