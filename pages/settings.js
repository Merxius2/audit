/**
 * Settings Page
 * Manage application settings and data
 */

import { useState } from 'react';
import { Settings, Trash2, Globe, DollarSign } from 'lucide-react';
import { deleteCookie } from '../lib/cookieStorage';
import { useRouter } from 'next/router';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
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

export default function SettingsPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const router = useRouter();
  const { t, language, changeLanguage } = useLanguage();
  const { currency, changeCurrency } = useCurrency();

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
    <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8">
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
            <h2 className="text-2xl font-bold text-gray-900">Language</h2>
          </div>
          <p className="text-gray-600 mb-6">Select your preferred language:</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex flex-col items-center gap-3 rounded-lg p-6 transition-all ${
                  language === lang.code
                    ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Image
                  src={lang.icon}
                  alt={lang.name}
                  width={48}
                  height={48}
                  className={`rounded-lg ${language === lang.code ? 'shadow-md' : ''}`}
                />
                <span className="text-sm font-semibold">{lang.flag}</span>
                <span className="text-xs font-medium text-center">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Selection Section */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign size={28} className="text-brand-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Currency</h2>
          </div>
          <p className="text-gray-600 mb-6">Select your preferred currency:</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {CURRENCY_OPTIONS.map((curr) => (
              <button
                key={curr.code}
                onClick={() => changeCurrency(curr.code)}
                className={`flex flex-col items-center gap-3 rounded-lg p-6 transition-all ${
                  currency === curr.code
                    ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span className="text-4xl font-bold">{curr.symbol}</span>
                <span className="text-sm font-semibold">{curr.flag}</span>
                <span className="text-xs font-medium text-center">{curr.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Data Section */}
        <div className="card p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('settings.resetData')}</h2>
              <p className="text-gray-600 mb-6">
                {t('settings.resetDesc')}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
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
            <div className={`mt-6 rounded-lg p-4 ${resetMessage.includes('successfully') || resetMessage.includes('успешно') || resetMessage.includes('başarı') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              <p className="font-medium">{resetMessage}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-8 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('settings.confirm')}</h3>
            <p className="text-gray-600 mb-6">
              {t('settings.confirmDesc')}
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelReset}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-50"
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
    </div>
  );
}
