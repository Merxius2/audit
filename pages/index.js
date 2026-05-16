/**
 * Home / Landing.
 * Mobile-focused — desktop users get auto-redirected to /overview by _app.js.
 * Shows the monkey icon (per language), brand, language picker, dark-mode
 * toggle, and a grid of tool tiles that link directly into the app.
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BarChart3, TrendingUp, Eye, CreditCard, Receipt, ShieldCheck } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
];

const LANG_ICON = {
  en: '/icon-e-512.png',
  nl: '/icon-n-512.png',
  ru: '/icon-r-512.png',
  tr: '/icon-t-512.png',
};

export default function Home() {
  const { t, language, changeLanguage, isLoading } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [langOpen, setLangOpen] = useState(false);

  // Hide language dropdown when clicking outside
  useEffect(() => {
    const close = () => setLangOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  if (isLoading) return <div className="min-h-screen" />;

  const iconPath = LANG_ICON[language] || LANG_ICON.en;
  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <>
      <Head>
        <title>Aap-FT</title>
      </Head>

      <div className="min-h-screen px-4 sm:px-6">
        {/* Floating top pill: language + theme */}
        <header className="sticky top-3 sm:top-4 z-30 pointer-events-none flex justify-center">
          <div className="pointer-events-auto glass-thick rounded-full px-2 h-12 flex items-center gap-1.5">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-full text-[13px] font-medium text-ink-soft hover:bg-black/5 transition"
              >
                <span className="text-[16px] leading-none">{currentLang.flag}</span>
                <span>{currentLang.code.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 glass-thick rounded-md overflow-hidden p-1">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { changeLanguage(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] rounded-sm text-left hover:bg-black/5 ${
                        language === l.code ? 'font-semibold' : ''
                      }`}
                    >
                      <span className="text-[15px]">{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full text-ink-soft hover:bg-black/5 transition"
              title={isDarkMode ? t('landing.lightMode') : t('landing.darkMode')}
              aria-label="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="pt-12 sm:pt-16 pb-10 text-center">
          <div className="inline-flex rounded-full overflow-hidden mb-6 shadow-soft-md">
            <Image src={iconPath} alt="Aap-FT" width={112} height={112} priority />
          </div>
          <h1 className="display text-[44px] sm:text-[56px] leading-[0.95] tracking-[-0.03em]">
            {t('landing.title')}
          </h1>
          <p className="text-[15px] text-ink-soft mt-3 max-w-sm mx-auto leading-relaxed">
            {t('landing.description')}
          </p>

          <Link href="/overview">
            <button className="mt-7 inline-flex items-center gap-2 h-12 px-6 rounded-full text-white text-[14px] font-semibold shadow-pill-tint"
                    style={{ background: 'linear-gradient(135deg,#3B5BFF 0%, #7B5BFF 100%)' }}>
              {t('landing.cta')}
              <ArrowRight size={16} />
            </button>
          </Link>

          <div className="mt-5 inline-flex items-center gap-1.5 text-[11.5px] text-ink-faint">
            <ShieldCheck size={12} />
            {(() => { const v = t('landing.privacyHint'); return v && !v.includes('landing.') ? v : 'Data stays in your browser'; })()}
          </div>
        </section>

        {/* Tools */}
        <section className="pb-32">
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint px-1 mb-3">
            {t('landing.otherToolsTitle') || 'Toolkit'}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <ToolTile href="/overview"   icon={Eye}         titleKey="navigation.overview"        idx="01" tint="tint" />
            <ToolTile href="/dashboard"  icon={BarChart3}   titleKey="navigation.householdBudget" idx="02" tint="violet" />
            <ToolTile href="/retirement" icon={TrendingUp}  titleKey="navigation.retirement"      idx="03" tint="mint" />
            <ToolTile href="/debt"       icon={CreditCard}  titleKey="navigation.debtCalculator"  idx="04" tint="amber" />
            <ToolTile href="/tax"        icon={Receipt}     titleKey="navigation.taxCalculator"   idx="05" tint="coral" />
          </div>
        </section>
      </div>
    </>
  );
}

function ToolTile({ href, icon: Icon, titleKey, idx, tint }) {
  const { t } = useLanguage();
  const tintMap = {
    tint:   { bg: 'bg-tint-soft',   fg: 'text-[#2A45CC]' },
    violet: { bg: 'bg-violet-soft', fg: 'text-[#4F3FA0]' },
    mint:   { bg: 'bg-mint-soft',   fg: 'text-[#1F8E6E]' },
    amber:  { bg: 'bg-amber-soft',  fg: 'text-[#8B5E20]' },
    coral:  { bg: 'bg-coral-soft',  fg: 'text-[#A8302A]' },
  };
  const c = tintMap[tint] || tintMap.tint;

  return (
    <Link href={href}>
      <div className="spring glass rounded-md p-4 cursor-pointer h-full">
        <div className="flex items-center justify-between mb-10">
          <span className={`inline-flex w-9 h-9 items-center justify-center rounded-full ${c.bg} ${c.fg}`}>
            <Icon size={17} />
          </span>
          <span className="text-[10px] mono text-ink-faint">{idx}</span>
        </div>
        <p className="text-[14px] font-semibold tracking-tight">{t(titleKey)}</p>
      </div>
    </Link>
  );
}
