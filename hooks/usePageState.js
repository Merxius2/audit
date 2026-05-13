import { useSidebar } from '../context/SidebarContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useIsMobile } from './useIsMobile';
import { useDebouncedCookie } from './useDebouncedCookie';

/**
 * Unified page state hook
 * Consolidates common page patterns: sidebar, mobile detection, language, currency, dark mode, cookies
 * @param {string} cookieKey - Cookie key for this page's data
 * @param {object} defaultData - Default data structure for this page
 * @returns {object} Object with all page state and utilities
 */
export function usePageState(cookieKey, defaultData = {}) {
  // Sidebar state
  const { isOpen, toggleSidebar } = useSidebar();

  // Mobile detection
  const isMobile = useIsMobile();

  // Language and translations
  const { language, t } = useLanguage();

  // Currency formatting
  const { currency, getSymbol } = useCurrency();

  // Dark mode
  const { isDarkMode } = useDarkMode();

  // Cookie persistence
  const debouncedSave = useDebouncedCookie(cookieKey, defaultData);

  return {
    // Sidebar
    isOpen,
    toggleSidebar,

    // Mobile
    isMobile,

    // Language & localization
    language,
    t,

    // Currency
    currency,
    getSymbol,

    // Dark mode
    isDarkMode,

    // Utilities
    saveToCookie: debouncedSave,
  };
}
