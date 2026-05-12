/**
 * App Component
 * Root wrapper with global context provider and navigation
 */

import '../styles/globals.css';
import { FinancialProvider } from '../context/FinancialContext';
import { LanguageProvider } from '../context/LanguageContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { DarkModeProvider } from '../context/DarkModeContext';
import { SecretSettingsProvider } from '../context/SecretSettingsContext';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import SecretSettingsModal from '../components/SecretSettingsModal';
import { useRouter } from 'next/router';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const { language } = useLanguage();
  const isHomePage = router.pathname === '/' || router.pathname === '/index';

  // Dynamically update favicon based on language selection
  useEffect(() => {
    const iconMap = {
      en: '/icon-e-192.png',
      nl: '/icon-n-192.png',
      ru: '/icon-r-192.png',
      tr: '/icon-t-192.png',
    };
    
    const iconPath = iconMap[language] || '/icon-e-192.png';
    
    // Update favicon in browser tab
    let faviconLink = document.querySelector("link[rel='icon'][type='image/png']");
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.type = 'image/png';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = iconPath;
    
    // Update Apple touch icon (for iOS home screen)
    let appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']");
    if (appleTouchIcon) {
      appleTouchIcon.href = iconPath;
    }
  }, [language]);

  return (
    <DarkModeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <FinancialProvider>
            {!isHomePage && (
              <>
                <Sidebar />
                <MobileNav />
              </>
            )}
            <Component {...pageProps} />
          </FinancialProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </DarkModeProvider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <FinancialProvider>
            <SecretSettingsProvider>
              <SecretSettingsModal />
              <AppContent Component={Component} pageProps={pageProps} />
            </SecretSettingsProvider>
          </FinancialProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </DarkModeProvider>
  );
}

export default MyApp;

