/**
 * Desktop sidebar — Liquid OS floating glass rail.
 * - Visible on lg+ only (mobile/tablet use MobileNav).
 * - Monkey icon logo per language (e/n/r/t), triple-click opens secret settings.
 * - Two sections: Financial audit / Calculators, plus Settings at the bottom.
 * - Active route gets a tint-soft pill that also works in dark mode.
 */

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BarChart3, TrendingUp, Eye, Settings, CreditCard, Receipt } from 'lucide-react';
import { useRef, useState } from 'react';

import { useLanguage } from '../context/LanguageContext';
import { useSecretSettings } from '../context/SecretSettingsContext';

const NAV = [
  {
    titleKey: 'navigation.financialAudit',
    items: [
      { path: '/overview',   labelKey: 'navigation.overview',        icon: Eye },
      { path: '/dashboard',  labelKey: 'navigation.householdBudget', icon: BarChart3 },
      { path: '/retirement', labelKey: 'navigation.retirement',      icon: TrendingUp },
    ],
  },
  {
    titleKey: 'navigation.otherTools',
    items: [
      { path: '/debt', labelKey: 'navigation.debtCalculator', icon: CreditCard },
      { path: '/tax',  labelKey: 'navigation.taxCalculator',  icon: Receipt },
    ],
  },
];

const LANG_ICON = { en: '/icon-e-192.png', nl: '/icon-n-192.png', ru: '/icon-r-192.png', tr: '/icon-t-192.png' };

export default function Sidebar() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { openSecretSettings } = useSecretSettings();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeout = useRef(null);

  const isActive = (path) => router.pathname === path;
  const iconPath = LANG_ICON[language] || LANG_ICON.en;

  const handleLogoClick = () => {
    setClickCount((n) => n + 1);
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    if (clickCount + 1 === 3) {
      openSecretSettings();
      setClickCount(0);
    } else {
      clickTimeout.current = setTimeout(() => setClickCount(0), 1000);
    }
  };

  const itemClass = (active) =>
    [
      'flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-[13.5px] font-medium transition-all',
      active
        ? 'bg-tint-soft text-[#2A45CC] dark:bg-tint/15 dark:text-[#C8D2FF]'
        : 'text-ink-soft hover:bg-black/[0.04] dark:text-[#A1A1AA] dark:hover:bg-white/[0.04]',
    ].join(' ');

  return (
    <aside className="hidden lg:flex fixed left-3 top-3 bottom-3 w-[220px] z-30 flex-col glass-thick rounded-md p-3">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-3">
        <button
          onClick={handleLogoClick}
          className="block rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
          title={clickCount > 0 ? `${3 - clickCount} clicks left to unlock secret settings` : 'Aap-FT'}
        >
          <Image src={iconPath} alt="Aap-FT" width={32} height={32} className="rounded-full" />
        </button>
        <span className="font-semibold text-[15px] tracking-tight">Aap-FT</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 px-1 mt-1 overflow-y-auto">
        {NAV.map((section) => (
          <div key={section.titleKey}>
            <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              {t(section.titleKey)}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <div className={itemClass(isActive(item.path))}>
                      <Icon size={17} />
                      <span>{t(item.labelKey)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings + footer */}
      <div className="border-t border-black/[0.06] dark:border-white/[0.06] pt-2.5 mt-2 px-1 space-y-2">
        <Link href="/settings">
          <div className={itemClass(isActive('/settings'))}>
            <Settings size={17} />
            <span>{t('navigation.settings')}</span>
          </div>
        </Link>
        <p className="px-2 text-[10px] text-ink-faint">© 2026 Aap-FT</p>
      </div>
    </aside>
  );
}
