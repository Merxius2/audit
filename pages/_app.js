import '../styles/globals.css';
import { FinancialProvider } from '../context/FinancialContext';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isHomePage = router.pathname === '/' || router.pathname === '/index';

  return (
    <FinancialProvider>
      {!isHomePage && <Sidebar />}
      <Component {...pageProps} />
    </FinancialProvider>
  );
}

export default MyApp;
