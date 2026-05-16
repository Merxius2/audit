/**
 * Mobile / tablet bottom navigation — floating glass pill.
 * Visible on screens < lg only. Pages with /debt or /tax show a back-to-home
 * button (matches original behaviour).
 *
 * 5 tabs: Overview · Budget · Retire · Tools (sheet → Debt/Tax) · Settings.
 * No "Home" tab — the home page is just the mobile landing, navigated to
 * via the overview→home link if a user really needs it.
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  BarChart3, TrendingUp, Eye, Settings, ArrowLeft, LayoutGrid,
  CreditCard, Receipt, ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileNav() {
  const router = useRouter();
  const { t } = useLanguage();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (path) => router.pathname === path;
  const isDebtOrTax = router.pathname === '/debt' || router.pathname === '/tax';

  // Floating pill class shared by the bar
  const pillBar =
    'fixed bottom-3 inset-x-3 z-[100] glass-thick rounded-full px-2 py-1.5 lg:hidden';
  const safePad = { paddingBottom: 'max(6px, env(safe-area-inset-bottom))' };

  // Debt / Tax: simple back-to-home pill
  if (isDebtOrTax) {
    return (
      <nav className={pillBar} style={safePad}>
        <div className="flex justify-center">
          <Link href="/">
            <button className="h-12 w-12 inline-flex items-center justify-center rounded-full text-white shadow-pill-tint"
                    style={{ background: 'linear-gradient(135deg,#3B5BFF 0%, #7B5BFF 100%)' }}>
              <ArrowLeft size={20} />
            </button>
          </Link>
        </div>
      </nav>
    );
  }

  const tabClass = (active) =>
    [
      'w-full flex flex-col items-center gap-0.5 py-1.5 rounded-full text-[10.5px] transition-colors',
      active ? 'bg-white text-[#2A45CC] font-semibold shadow-sm' : 'text-ink-soft',
    ].join(' ');

  return (
    <>
      <nav className={pillBar} style={safePad}>
        <ul className="grid grid-cols-5 gap-0.5">
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
            <button
              onClick={() => setSheetOpen(true)}
              className={tabClass(false) + ' relative'}
              aria-label={t('navigation.otherTools')}
            >
              <LayoutGrid size={18} />
              <span>{t('navigation.otherTools')}</span>
            </button>
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

      {/* Tools sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 glass-thick rounded-t-md p-5 pb-8">
            <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink-faint mb-2">
              {t('navigation.otherTools')}
            </p>
            <Link href="/debt" onClick={() => setSheetOpen(false)}>
              <button className="w-full flex items-center gap-3 py-3 border-b border-black/[0.06]">
                <span className="w-9 h-9 rounded-full bg-amber-soft text-[#8B5E20] inline-flex items-center justify-center">
                  <CreditCard size={16} />
                </span>
                <div className="flex-1 text-left">
                  <p className="text-[13.5px] font-medium">{t('navigation.debtCalculator')}</p>
                </div>
                <ChevronRight size={16} className="text-ink-faint" />
              </button>
            </Link>
            <Link href="/tax" onClick={() => setSheetOpen(false)}>
              <button className="w-full flex items-center gap-3 py-3">
                <span className="w-9 h-9 rounded-full bg-coral-soft text-[#A8302A] inline-flex items-center justify-center">
                  <Receipt size={16} />
                </span>
                <div className="flex-1 text-left">
                  <p className="text-[13.5px] font-medium">{t('navigation.taxCalculator')}</p>
                </div>
                <ChevronRight size={16} className="text-ink-faint" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
