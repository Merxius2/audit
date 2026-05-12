/**
 * Settings Page
 * Manage application settings and data
 */

import { useState } from 'react';
import { Settings, Trash2, Globe, DollarSign, Moon, Sun } from 'lucide-react';
import { deleteCookie } from '../lib/cookieStorage';
import { useRouter } from 'next/router';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useDarkMode } from '../context/DarkModeContext';
import Image from 'next/image';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English', icon: '/icon-e-192.png' },
  { code: 'nl', flag: '🇳🇱', name: 'Dutch', icon: '/icon-n-192.png' },
  { code: 'ru', flag: '🇷🇺', name: 'Russian', icon: '/icon-r-192.png' },
  { code: 'tr', flag: '🇹🇷', name: 'Turkish', icon: '/icon-t-192.png' },
];

const CURRENCY_OPTIONS = [
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'USD', symbol: '$', name: 'Dollar', flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', name: 'Pound', flag: '🇬🇧' },
  { code: 'RUB', symbol: '₽', name: 'Ruble', flag: '🇷🇺' },
  { code: 'TRY', symbol: '₺', name: 'Lira', flag: '🇹🇷' },
];

const ICON_MAP = {
  en: 'e',
  nl: 'n',
  ru: 'r',
  tr: 't',
};

export default function SettingsPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const router = useRouter();
  const { t, language, changeLanguage } = useLanguage();
  const { currency, changeCurrency } = useCurrency();
  const { isDarkMode, toggleDarkMode, isAutoMode, toggleAutoMode } = useDarkMode();

  const handleResetData = () => {
    setShowConfirmation(true);
  };

  const confirmReset = () => {
    try {
      deleteCookie('huishoudboekje_data');
      deleteCookie('retirement_data');
      setResetMessage(t('settings.success'));
      setShowConfirmation(false);
      
      // Refresh the page after 1.5 seconds
      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch (error) {
      setResetMessage(t('settings.error'));
    }
  };

  const cancelReset = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-white pb-40 md:ml-64 md:pb-0">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Settings size={36} className="text-brand-primary" />
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{t('settings.title')}</h1>
          </div>
          <p className="text-gray-600">{t('settings.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
        {/* Language Selection Section */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={28} className="text-brand-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings.language')}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('settings.languageDesc')}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex flex-col items-center gap-3 rounded-lg p-6 transition-all ${
                  language === lang.code
                    ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-3xl font-semibold">{lang.flag}</span>
                <span className="text-xs font-medium text-center">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Selection Section */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign size={28} className="text-brand-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings.currency')}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('settings.currencyDesc')}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {CURRENCY_OPTIONS.map((curr) => (
              <button
                key={curr.code}
                onClick={() => changeCurrency(curr.code)}
                className={`flex flex-col items-center gap-3 rounded-lg p-6 transition-all ${
                  currency === curr.code
                    ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-4xl font-bold">{curr.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dark Mode Toggle Section */}
        <div className="card p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              {isDarkMode ? (
                <Moon size={28} className="text-brand-primary flex-shrink-0" />
              ) : (
                <Sun size={28} className="text-brand-primary flex-shrink-0" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings.darkMode')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('settings.darkModeDesc')}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              disabled={isAutoMode}
              className={`relative flex-shrink-0 h-8 w-14 items-center rounded-full transition-colors inline-flex ${
                isAutoMode ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDarkMode
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Auto Dark Mode Toggle Section */}
        <div className="card p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Globe size={28} className="text-brand-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings.autoDarkMode')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('settings.autoDarkModeDesc')}</p>
              </div>
            </div>
            <button
              onClick={toggleAutoMode}
              className={`relative flex-shrink-0 h-8 w-14 items-center rounded-full transition-colors inline-flex ${
                isAutoMode
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isAutoMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset Data Section */}
        <div className="card p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('settings.resetData')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('settings.resetDesc')}
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>{t('settings.warning')}</strong>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleResetData}
            className="inline-flex items-center space-x-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
          >
            <Trash2 size={20} />
            <span>{t('settings.clearButton')}</span>
          </button>

          {/* Success Message */}
          {resetMessage && (
            <div className={`mt-6 rounded-lg p-4 ${resetMessage.includes('successfully') || resetMessage.includes('успешно') || resetMessage.includes('başarı') ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
              <p className="font-medium">{resetMessage}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99]">
          <div className="card p-8 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">{t('settings.confirm')}</h3>
            <p className="text-gray-600 mb-6 dark:text-gray-300">
              {t('settings.confirmDesc')}
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelReset}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t('settings.cancel')}
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-all hover:bg-red-700"
              >
                {t('settings.clearButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile App Icon Footer */}
      <div className="md:hidden mt-4 flex justify-center pb-2">
        <Image
          src={`/icon-${ICON_MAP[language]}-192.png`}
          alt="Aap-FT"
          width={120}
          height={120}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
