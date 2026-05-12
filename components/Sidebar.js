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
  const { achievementMode } = useSecretModes();
  const [clickCount, setClickCount] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const clickTimeout = useRef(null);

  const isActive = (path) => router.pathname === path;

  // Load achievements when achievement mode is active
  useEffect(() => {
    if (achievementMode) {
      const saved = loadFromCookie('unlocked_achievements') || [];
      setUnlockedAchievements(saved);
    }
  }, [achievementMode]);

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
    ...(achievementMode ? [{ path: '/achievements', labelKey: 'navigation.achievements', icon: Trophy }] : []),
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
      {achievementMode && unlockedAchievements.length > 0 && (
        <div className="mb-6 border-b border-gray-200 pb-6 dark:border-gray-800">
          <Link href="/achievements">
            <div className="flex items-center justify-between mb-3 cursor-pointer group">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Badges</span>
              </div>
              <span className="text-xs font-bold bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
                {unlockedAchievements.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {unlockedAchievements.slice(0, 6).map((id) => {
                const achievementEmojis = {
                  first_savings: '🌱',
                  first_1000: '💰',
                  first_5000: '🏆',
                  balanced_budget: '⚖️',
                  great_savings_rate: '📈',
                  no_debt: '✨',
                };
                return (
                  <div
                    key={id}
                    className="flex items-center justify-center w-full aspect-square bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
                    title={id}
                  >
                    {achievementEmojis[id] || '🏅'}
                  </div>
                );
              })}
            </div>
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <p>© 2026 Aap Financial Tools</p>
      </div>
    </div>
  );
}

