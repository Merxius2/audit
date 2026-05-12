/**
 * Desktop Sidebar Navigation Component
 * Displays logo, age bracket selector, and main navigation links
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { BarChart3, TrendingUp, Settings, Menu } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export default function Sidebar() {
  const router = useRouter();
  const { selectedAgeBracket, setSelectedAgeBracket } = useFinancial();
  const ageBrackets = ['18-29', '30-44', '45-59', '60+'];

  const isActive = (path) => router.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/retirement', label: 'Retirement', icon: TrendingUp },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="hidden md:fixed md:left-0 md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white md:p-6 md:shadow-soft">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-3xl font-bold text-transparent">
          Aap-FT
        </h1>
        <p className="mt-1 text-xs font-medium text-gray-500">Financial Tools</p>
      </div>

      {/* Age Bracket Selector */}
      <div className="mb-8">
        <label className="mb-3 block text-sm font-semibold text-gray-700">
          Age Bracket
        </label>
        <select
          value={selectedAgeBracket}
          onChange={(e) => setSelectedAgeBracket(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
        >
          {ageBrackets.map((bracket) => (
            <option key={bracket} value={bracket}>
              {bracket}
            </option>
          ))}
        </select>
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
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
        <p>© 2026 Aap Financial Tools</p>
      </div>
    </div>
  );
}

