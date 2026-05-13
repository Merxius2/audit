/**
 * Mobile Bottom Navigation Component
 * Displays icon-based navigation for mobile devices
 * Matches modern mobile app patterns with centered action button
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { BarChart3, TrendingUp, Eye, Settings, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileNav() {
  const router = useRouter();
  const { t } = useLanguage();

  const isActive = (path) => router.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: BarChart3, labelKey: 'navigation.householdBudget' },
    { path: '/retirement', icon: TrendingUp, labelKey: 'navigation.retirement' },
    { path: '/overview', icon: Eye, labelKey: 'navigation.overview', isPrimary: true },
    { path: '/debt', icon: DollarSign, labelKey: 'navigation.debtCalculator' },
    { path: '/settings', icon: Settings, labelKey: 'navigation.settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 bg-white md:hidden dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-center px-4 py-3">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.path} className="flex-1 flex justify-center">
              <Link href={item.path}>
                {item.isPrimary ? (
                  <button className="relative -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/30 transition-transform hover:scale-110">
                    <Icon size={24} />
                  </button>
                ) : (
                  <div
                    className={`flex flex-col items-center space-y-0.5 px-1 py-1 transition-colors ${
                      isActive(item.path)
                        ? 'text-brand-primary'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-[10px] font-medium whitespace-nowrap">{t(item.labelKey)}</span>
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
