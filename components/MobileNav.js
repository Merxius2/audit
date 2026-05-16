/**
 * Mobile / tablet bottom navigation — floating glass pill.
 * Visible on screens < lg only. Pages with /debt or /tax show only the
 * home button at the top right, without a bottom navigation bar.
 *
 * 4 tabs on main pages: Overview · Budget · Retire · Settings.
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BarChart3, TrendingUp, Eye, Settings, Home,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileNav() {
  const router = useRouter();
  const { t } = useLanguage();

  const isActive = (path) => router.pathname === path;
  const isDebtOrTax = router.pathname === '/debt' || router.pathname === '/tax';
  const isBenchmarkOrFire = router.pathname === '/benchmark' || router.pathname === '/fire-calculator';

  // Floating pill class shared by the bar
  const pillBar =
    'fixed bottom-3 inset-x-3 z-[100] glass-thick rounded-full px-2 py-1.5 lg:hidden';
  const safePad = { paddingBottom: 'max(6px, env(safe-area-inset-bottom))' };

  // Debt / Tax / Benchmark / FIRE: only show home button at top right, no bottom navigation
  if (isDebtOrTax || isBenchmarkOrFire) {
    return (
      <Link href="/">
        <button className="fixed top-3 right-3 h-12 w-12 lg:hidden z-[99] inline-flex items-center justify-center rounded-full text-white shadow-pill-tint transition-transform hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#3B5BFF 0%, #7B5BFF 100%)' }}
                title="Home">
          <Home size={20} />
        </button>
      </Link>
    );
  }

  const tabClass = (active) =>
    [
      'w-full flex flex-col items-center gap-0.5 py-1.5 rounded-full text-[10.5px] transition-colors',
      active ? 'bg-white text-[#2A45CC] font-semibold shadow-sm' : 'text-ink-soft',
    ].join(' ');

  return (
    <>
      {/* Home button (top right, mobile only, hidden on landing page) */}
      {!isActive('/') && (
        <Link href="/">
          <button className="fixed top-3 right-3 h-12 w-12 lg:hidden z-[99] inline-flex items-center justify-center rounded-full text-white shadow-pill-tint transition-transform hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#3B5BFF 0%, #7B5BFF 100%)' }}
                  title="Home">
            <Home size={20} />
          </button>
        </Link>
      )}

      <nav className={pillBar} style={safePad}>
        <ul className="grid grid-cols-4 gap-0.5">
          <li>
            <Link href="/overview">
              <button className={tabClass(isActive('/overview'))}>
                <Eye size={18} />
                <span>{t('navigation.overview')}</span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/dashboard">
              <button className={tabClass(isActive('/dashboard'))}>
                <BarChart3 size={18} />
                <span>{t('navigation.householdBudget')}</span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/retirement">
              <button className={tabClass(isActive('/retirement'))}>
                <TrendingUp size={18} />
                <span>{t('navigation.retirement')}</span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <button className={tabClass(isActive('/settings'))}>
                <Settings size={18} />
                <span>{t('navigation.settings')}</span>
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
