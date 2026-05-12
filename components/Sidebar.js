import Link from 'next/link';
import { useRouter } from 'next/router';
import { BarChart3, TrendingUp, Settings } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export default function Sidebar() {
  const router = useRouter();
  const { selectedAgeBracket, setSelectedAgeBracket } = useFinancial();
  const ageBrackets = ['18-29', '30-44', '45-59', '60+'];

  const isActive = (path) => router.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/10 p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Aap-FT
        </h1>
        <p className="text-xs text-white/50 mt-1">Financial Tools</p>
      </div>

      {/* Age Bracket Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-white/70 mb-3">
          Age Bracket
        </label>
        <select
          value={selectedAgeBracket}
          onChange={(e) => setSelectedAgeBracket(e.target.value)}
          className="w-full"
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
        <Link href="/dashboard">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer ${
              isActive('/dashboard')
                ? 'bg-white/10 border border-white/20'
                : 'hover:bg-white/5'
            }`}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </div>
        </Link>

        <Link href="/retirement">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer ${
              isActive('/retirement')
                ? 'bg-white/10 border border-white/20'
                : 'hover:bg-white/5'
            }`}
          >
            <TrendingUp size={20} />
            <span>Retirement</span>
          </div>
        </Link>

        <Link href="/settings">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer ${
              isActive('/settings')
                ? 'bg-white/10 border border-white/20'
                : 'hover:bg-white/5'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </Link>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 pt-4 text-xs text-white/50">
        <p>© 2026 Aap Financial Tools</p>
      </div>
    </div>
  );
}
