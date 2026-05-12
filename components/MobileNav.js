/**
 * Mobile Bottom Navigation Component
 * Displays icon-based navigation for mobile devices
 * Matches modern mobile app patterns with centered action button
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Folder, Plus, Inbox, Settings } from 'lucide-react';

export default function MobileNav() {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/portfolio', icon: Folder, label: 'Portfolio' },
    { path: '/retirement', icon: Plus, label: 'Add', isPrimary: true },
    { path: '/inbox', icon: Inbox, label: 'Inbox' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white md:hidden">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              {item.isPrimary ? (
                <button className="relative -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/30 transition-transform hover:scale-110">
                  <Icon size={24} />
                </button>
              ) : (
                <div
                  className={`flex flex-col items-center space-y-1 px-4 py-2 transition-colors ${
                    isActive(item.path)
                      ? 'text-brand-primary'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
