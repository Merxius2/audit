/**
 * App Component
 * Root wrapper with global context provider and navigation
 */

import '../styles/globals.css';
import { FinancialProvider } from '../context/FinancialContext';
import { LanguageProvider } from '../context/LanguageContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isHomePage = router.pathname === '/' || router.pathname === '/index';

  return (
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
  );
}

export default MyApp;

