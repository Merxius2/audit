/**
 * Household Budget Page - Income & Expense Tracking
 * Main orchestration component for the dashboard
 * Uses separate hooks and components for shared and separate modes
 */

import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { loadFromCookie, saveToCookie } from '../lib/cookieStorage';
import { useSharedDashboard } from '../hooks/useSharedDashboard';
import { useSeparateDashboard } from '../hooks/useSeparateDashboard';
import PageHeader from '../components/PageHeader';
import SharedModeSection from '../components/SharedModeSection';
import SeparateModeSection from '../components/SeparateModeSection';

export default function Dashboard() {
  const [calculationType, setCalculationType] = useState('shared');
  const { getSymbol } = useCurrency();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Load calculation type preference
  useEffect(() => {
    const savedData = loadFromCookie('AUDIT_DASHBOARD_DATA');
    if (savedData?.calculationType) {
      setCalculationType(savedData.calculationType);
    }
  }, []);

  // Save calculation type whenever it changes
  useEffect(() => {
    const savedData = loadFromCookie('AUDIT_DASHBOARD_DATA') || {};
    saveToCookie('AUDIT_DASHBOARD_DATA', { ...savedData, calculationType }, 365);
  }, [calculationType]);

  // Use hooks for shared and separate modes
  const sharedMode = useSharedDashboard();
  const separateMode = useSeparateDashboard();
  const isLoading = sharedMode.isLoading && separateMode.isLoading;

  if (isLoading) {
    return <div className="min-h-screen bg-white pb-32 lg:ml-64 md:pb-0" />;
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:ml-64 md:pb-0">
      <PageHeader icon={BarChart3} titleKey="dashboard.title" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Calculation Type Toggle */}
        <div className="card p-6 mb-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t('dashboard.calculationType')}</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setCalculationType('shared')}
              className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-all ${
                calculationType === 'shared'
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-soft'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('dashboard.mode.shared')}
            </button>
            <button
              onClick={() => setCalculationType('separate')}
              className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-all ${
                calculationType === 'separate'
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-soft'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('dashboard.mode.separate')}
            </button>
          </div>
        </div>
      </div>

      {/* Shared Mode Content */}
      {calculationType === 'shared' && (
        <SharedModeSection
          incomes={sharedMode.incomes}
          addIncome={sharedMode.addIncome}
          updateIncome={sharedMode.updateIncome}
          removeIncome={sharedMode.removeIncome}
          savings={sharedMode.savings}
          setSavings={sharedMode.setSavings}
          includeSavingsInCalculations={sharedMode.includeSavingsInCalculations}
          setIncludeSavingsInCalculations={sharedMode.setIncludeSavingsInCalculations}
          expenses={sharedMode.expenses}
          setExpenses={sharedMode.setExpenses}
          getSymbol={getSymbol}
          t={t}
          pieData={sharedMode.pieData}
          leftover={sharedMode.leftover}
          totalExpenses={sharedMode.totalExpenses}
          totalIncome={sharedMode.totalIncome}
        />
      )}

      {/* Separate Mode Content */}
      {calculationType === 'separate' && (
        <SeparateModeSection
          person1Name={separateMode.person1Name}
          setPerson1Name={separateMode.setPerson1Name}
          person2Name={separateMode.person2Name}
          setPerson2Name={separateMode.setPerson2Name}
          person1Incomes={separateMode.person1Incomes}
          setPerson1Incomes={separateMode.setPerson1Incomes}
          person1Savings={separateMode.person1Savings}
          setPerson1Savings={separateMode.setPerson1Savings}
          person1Expenses={separateMode.person1Expenses}
          setPerson1Expenses={separateMode.setPerson1Expenses}
          person2Incomes={separateMode.person2Incomes}
          setPerson2Incomes={separateMode.setPerson2Incomes}
          person2Savings={separateMode.person2Savings}
          setPerson2Savings={separateMode.setPerson2Savings}
          person2Expenses={separateMode.person2Expenses}
          setPerson2Expenses={separateMode.setPerson2Expenses}
          sharedExpenses={separateMode.sharedExpenses}
          setSharedExpenses={separateMode.setSharedExpenses}
          getSymbol={getSymbol}
          t={t}
          isMobile={isMobile}
          person1Contribution={separateMode.person1Contribution}
          person2Contribution={separateMode.person2Contribution}
          person1Ratio={separateMode.person1Ratio}
          person2Ratio={separateMode.person2Ratio}
          person1PersonalExpenses={separateMode.person1PersonalExpenses}
          person2PersonalExpenses={separateMode.person2PersonalExpenses}
          person1SavingsNum={separateMode.person1SavingsNum}
          person2SavingsNum={separateMode.person2SavingsNum}
          sharedExpensesTotal={separateMode.sharedExpensesTotal}
        />
      )}
    </div>
  );
}
