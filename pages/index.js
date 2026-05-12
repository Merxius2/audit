/**
 * Home Page - Landing
 * Modern bright landing page with feature showcase
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'nl', flag: '🇳🇱', name: 'Dutch' },
  { code: 'ru', flag: '🇷🇺', name: 'Russian' },
  { code: 'tr', flag: '🇹🇷', name: 'Turkish' },
];

const getLanguageIcon = (language) => {
  const iconMap = {
    en: '/icon-e-512.png',
    nl: '/icon-n-512.png',
    ru: '/icon-r-512.png',
    tr: '/icon-t-512.png',
  };
  return iconMap[language] || '/icon-e-512.png';
};

export default function Home() {
  const [time, setTime] = useState('');
  const { t, language, changeLanguage, isLoading } = useLanguage();

  useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <>
      <Head>
        <title>Aap-FT</title>
      </Head>
      <div className="min-h-screen bg-white">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.03) 15%, rgba(255, 255, 255, 0) 40%)',
          }}
        />

        {/* Language Selector */}
        <div className="fixed top-6 right-6">
          <div className="flex gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                  language === lang.code
                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={lang.name}
              >
                <span className="text-2xl">{lang.flag}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="max-w-2xl text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Image src={getLanguageIcon(language)} alt="Aap-FT Logo" width={120} height={120} className="rounded-3xl shadow-lg" />
            </div>
            <h1 className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
              {t('landing.title')}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-gray-900">{t('landing.subtitle')}</p>
            <p className="mt-3 text-lg text-gray-600">
              {t('landing.description')}
            </p>

            {/* Features Grid */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="card p-6">
                <BarChart3 className="mx-auto mb-3 text-brand-primary" size={32} />
                <h3 className="font-semibold text-gray-900">{t('landing.budgetLabel')}</h3>
                <p className="mt-2 text-sm text-gray-600">{t('landing.budgetDesc')}</p>
              </div>

              <div className="card p-6">
                <TrendingUp className="mx-auto mb-3 text-brand-secondary" size={32} />
                <h3 className="font-semibold text-gray-900">{t('landing.retirementLabel')}</h3>
                <p className="mt-2 text-sm text-gray-600">{t('landing.retirementDesc')}</p>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/dashboard">
              <button className="mt-12 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-8 py-4 font-semibold text-white shadow-lg shadow-brand-primary/30 transition-all hover:shadow-lg hover:shadow-brand-primary/50 active:scale-95">
                <span>{t('landing.cta')}</span>
                <ArrowRight size={20} />
              </button>
            </Link>

            {/* Time Display */}
            {time && <p className="mt-12 text-sm text-gray-500">{time}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

