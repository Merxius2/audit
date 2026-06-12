/**
 * Settings Page
 * Manage application settings and data
 */

import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../context/UserPreferencesContext';
import { useSecretSettings } from '../context/FeatureContext';
import { LANGUAGE_ICON_MAP } from '../lib/appConstants';
import PageHeader from '../components/PageHeader';
import LanguageSettings from '../components/settings/LanguageSettings';
import CurrencySettings from '../components/settings/CurrencySettings';
import ThemeSettings from '../components/settings/ThemeSettings';
import DarkModeSettings from '../components/settings/DarkModeSettings';
import TaxSettingsPanel from '../components/settings/TaxSettingsPanel';
import ImportExportPanel from '../components/settings/ImportExportPanel';
import ResetDataSection from '../components/settings/ResetDataSection';

export default function SettingsPage() {
  const [clickCount, setClickCount] = useState(0);
  const { language } = useLanguage();
  const { openSecretSettings } = useSecretSettings();

  const handleIconClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 3) {
      openSecretSettings();
      setClickCount(0);
    } else {
      setTimeout(() => setClickCount(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-40 lg:ml-64 md:pb-0">
      <PageHeader icon={SettingsIcon} titleKey="settings.title" />

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
        <LanguageSettings />
        <CurrencySettings />
        <ThemeSettings />
        <DarkModeSettings />
        <TaxSettingsPanel />
        <ImportExportPanel />
        <ResetDataSection />
      </div>

      <div className="md:hidden mt-4 flex justify-center pb-2">
        <button
          type="button"
          onClick={handleIconClick}
          className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title={clickCount > 0 ? `${3 - clickCount} clicks left to unlock secret settings` : ''}
        >
          <Image
            src={`/icon-${LANGUAGE_ICON_MAP[language] || 'e'}-192.png`}
            alt="Aap-FT"
            width={120}
            height={120}
            className="rounded-xl"
          />
        </button>
      </div>
    </div>
  );
}
