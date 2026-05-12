/**
 * App Component
 * Root wrapper with global context provider and navigation
 */

import '../styles/globals.css';
import { FinancialProvider } from '../context/FinancialContext';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isHomePage = router.pathname === '/' || router.pathname === '/index';

  return (
    <FinancialProvider>
      {!isHomePage && (
        <>
          <Sidebar />
          <MobileNav />
        </>
      )}
      <Component {...pageProps} />
    </FinancialProvider>
  );
}

export default MyApp;

