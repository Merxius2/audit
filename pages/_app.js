/**
 * App root.
 * Wraps every page in the global providers plus the AmbientBackground
 * (Liquid-OS mesh layer). Sidebar & MobileNav render on every non-home page.
 */

import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { DarkModeProvider } from '../context/DarkModeContext';
import { SecretSettingsProvider } from '../context/SecretSettingsContext';
import { SidebarProvider } from '../context/SidebarContext';
import { TaxProvider } from '../context/TaxContext';

import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import ErrorBoundary from '../components/ErrorBoundary';
import SecretSettingsModal from '../components/SecretSettingsModal';
import AmbientBackground from '../components/AmbientBackground';

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const { language } = useLanguage();
  const isHomePage = router.pathname === '/' || router.pathname === '/index';
  const hidesMobileNav = router.pathname === '/benchmark' || router.pathname === '/fire-calculator';

  // Desktop users skip the marketing landing — go straight to the app.
  useEffect(() => {
    const checkDesktop = () => {
      const desktop = typeof window !== 'undefined' && window.innerWidth >= 768;
      if (desktop && isHomePage) router.push('/overview');
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, [isHomePage, router]);

  // Favicon swaps with the selected language (monkey icon e/n/r/t).
  useEffect(() => {
    const iconMap = {
      en: '/icon-e-192.png',
      nl: '/icon-n-192.png',
      ru: '/icon-r-192.png',
      tr: '/icon-t-192.png',
    };
    const iconPath = iconMap[language] || '/icon-e-192.png';

    let faviconLink = document.querySelector("link[rel='icon'][type='image/png']");
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.type = 'image/png';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = iconPath;

    const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']");
    if (appleTouchIcon) appleTouchIcon.href = iconPath;
  }, [language]);

  return (
    <>
      <AmbientBackground />
      {!isHomePage && (
        <>
          <Sidebar />
          {!hidesMobileNav && <MobileNav />}
        </>
      )}
      <Component {...pageProps} />
    </>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <TaxProvider>
              <SidebarProvider>
                <SecretSettingsProvider>
                  <SecretSettingsModal />
                  <AppContent Component={Component} pageProps={pageProps} />
                </SecretSettingsProvider>
              </SidebarProvider>
            </TaxProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
