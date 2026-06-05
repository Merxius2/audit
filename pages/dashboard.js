/**
 * Household Budget Page - Income & Expense Tracking
 * Main orchestration component for the dashboard
 * Uses separate hooks and components for shared and separate modes
 */

import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { useCurrency, useLanguage } from '../context/UserPreferencesContext';
import { loadFromCookie, saveToCookie } from '../lib/cookieStorage';
import { useSharedDashboard } from '../hooks/useSharedDashboard';
import { useSeparateDashboard } from '../hooks/useSeparateDashboard';
import PageHeader from '../components/PageHeader';
import ModeToggle from '../components/ModeToggle';
import SharedModeSection from '../components/SharedModeSection';
import SeparateModeSection from '../components/SeparateModeSection';

export default function Dashboard() {
  const [calculationType, setCalculationType] = useState('shared');
  const [isInitialized, setIsInitialized] = useState(false);
  const { getSymbol } = useCurrency();
  const { t } = useLanguage();

  // Load calculation type preference first, before anything else saves
  useEffect(() => {
    const savedData = loadFromCookie('AUDIT_DASHBOARD_DATA');
    if (savedData?.calculationType) {
      setCalculationType(savedData.calculationType);
    }
    setIsInitialized(true);
  }, []);

  // Save calculation type ONLY after initialization is complete
  useEffect(() => {
    if (!isInitialized) return;
    
    const savedData = loadFromCookie('AUDIT_DASHBOARD_DATA') || {};
    saveToCookie('AUDIT_DASHBOARD_DATA', { ...savedData, calculationType }, 365);
  }, [calculationType, isInitialized]);

  // Only activate the hook for the current calculation mode
  const isShared = calculationType === 'shared';
  const sharedMode = useSharedDashboard(isInitialized, isShared);
  const separateMode = useSeparateDashboard(isInitialized, !isShared);
  const isLoading = !isInitialized || (isShared ? sharedMode.isLoading : separateMode.isLoading);

  if (isLoading) {
    return <div className="min-h-screen bg-white pb-32 lg:ml-64 md:pb-0" />;
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:ml-64 md:pb-0">
      <PageHeader icon={BarChart3} titleKey="dashboard.title" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Calculation Type Toggle */}
        <div className="card p-6 mb-6">
          <ModeToggle
            label={t('dashboard.calculationType')}
            options={[
              { id: 'shared', label: t('dashboard.mode.shared') },
              { id: 'separate', label: t('dashboard.mode.separate') },
            ]}
            value={calculationType}
            onChange={setCalculationType}
          />
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
