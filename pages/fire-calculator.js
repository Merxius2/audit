/**
 * FIRE Calculator Page
 * Calculate Financial Independence, Retire Early (FIRE) target
 * Using the 4% safe withdrawal rate rule
 */

import { useState, useEffect, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { loadFromCookie, saveToCookie } from '../lib/cookieStorage';
import { EXPENSE_CATEGORIES } from '../lib/constants';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useDebouncedCookie } from '../hooks/useDebouncedCookie';
import PageHeader from '../components/PageHeader';

export default function FIRECalculator() {
  const [mode, setMode] = useState('manual'); // 'manual' or 'dynamic'
  const [desiredWithdrawal, setDesiredWithdrawal] = useState('');
  const [currentInvestments, setCurrentInvestments] = useState('');
  const [categoryOverrides, setCategoryOverrides] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [importError, setImportError] = useState('');
  const [annualWithdrawal, setAnnualWithdrawal] = useState(0);

  const { getSymbol } = useCurrency();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Load from cookies on mount
  useEffect(() => {
    const savedData = loadFromCookie('AUDIT_FIRE_DATA');
    if (savedData) {
      if (savedData.mode) setMode(savedData.mode);
      if (savedData.desiredWithdrawal) setDesiredWithdrawal(savedData.desiredWithdrawal);
      if (savedData.currentInvestments) setCurrentInvestments(savedData.currentInvestments);
      if (savedData.categoryOverrides) setCategoryOverrides(savedData.categoryOverrides);
    }
    setIsLoading(false);
  }, []);

  // Debounced cookie save
  const debouncedSave = useDebouncedCookie('AUDIT_FIRE_DATA', {
    mode,
    desiredWithdrawal,
    currentInvestments,
    categoryOverrides,
  });

  useEffect(() => {
    if (!isLoading) {
      debouncedSave();
    }
  }, [mode, desiredWithdrawal, currentInvestments, categoryOverrides, isLoading, debouncedSave]);

  // Calculate annual withdrawal based on mode
  useEffect(() => {
    if (mode === 'manual') {
      setAnnualWithdrawal(parseFloat(desiredWithdrawal) || 0);
    } else {
      // Dynamic mode: calculate from dashboard data
      try {
        const dashboardData = loadFromCookie('AUDIT_DASHBOARD_DATA');
        if (!dashboardData) {
          setImportError(t('fire.importFailed'));
          setAnnualWithdrawal(0);
          return;
        }

        // Calculate total monthly expenses from dashboard
        let totalMonthly = 0;
        if (dashboardData.expenses) {
          Object.values(dashboardData.expenses).forEach((amount) => {
            totalMonthly += parseFloat(amount) || 0;
          });
        }

        // Apply any category overrides
        Object.entries(categoryOverrides).forEach(([category, override]) => {
          if (override !== undefined && override !== '') {
            totalMonthly = totalMonthly - (parseFloat(dashboardData.expenses?.[category]) || 0) + (parseFloat(override) || 0);
          }
        });

        setImportError('');
        setAnnualWithdrawal(totalMonthly * 12); // Convert to annual
      } catch (error) {
        setImportError(t('fire.importFailed'));
        setAnnualWithdrawal(0);
      }
    }
  }, [mode, desiredWithdrawal, categoryOverrides, t]);

  // FIRE calculations (4% rule: FIRE Number = Annual Withdrawal × 25)
  const fireNumber = annualWithdrawal * 25;
  const leanFire = fireNumber * 0.75;
  const fatFire = fireNumber * 1.25;
  const monthlyWithdrawal = (fireNumber * 0.04) / 12;
  const currentAmount = parseFloat(currentInvestments) || 0;
  const percentToGoal = fireNumber > 0 ? Math.min((currentAmount / fireNumber) * 100, 100) : 0;
  const yearsToFire = fireNumber > 0 && currentAmount < fireNumber
    ? Math.log(fireNumber / currentAmount) / Math.log(1.07)
    : 0;

  const MilestoneCard = ({ title, amount, isActive }) => (
    <div className={`card p-6 ${isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {getSymbol()}{(amount || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
      </p>
      {isActive && (
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">← {t('fire.milestones.target')}</p>
      )}
    </div>
  );

  if (isLoading) {
    return <div className="min-h-screen bg-white lg:ml-64" />;
  }

  return (
    <div className="min-h-screen bg-white lg:ml-64">
      <PageHeader icon={Zap} titleKey="fire.title" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Mode Toggle */}
        <div className="card p-6 md:p-8 mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('fire.modes.manual')} / {t('fire.modes.dynamic')}
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => { setMode('manual'); setImportError(''); }}
              className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-all ${
                mode === 'manual'
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-soft'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('fire.modes.manual')}
            </button>
            <button
              onClick={() => setMode('dynamic')}
              className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-all ${
                mode === 'dynamic'
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-soft'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('fire.modes.dynamic')}
            </button>
          </div>
        </div>

        {/* Manual / Dynamic Input */}
        <div className="card p-6 md:p-8 mb-8">
          {mode === 'manual' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('fire.desiredAnnualWithdrawal')}
              </label>
              <input
                type="number"
                value={desiredWithdrawal}
                onChange={(e) => setDesiredWithdrawal(e.target.value)}
                placeholder="0"
                className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('fire.formula')}</p>
            </div>
          ) : (
            <div>
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200">{t('fire.manualDesc')}</p>
                {importError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">{importError}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('fire.desiredAnnualWithdrawal')}
                  </p>
                  <div className="amount-large text-gray-900 dark:text-white font-semibold">
                    {getSymbol()}{(annualWithdrawal || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('fire.annual')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('fire.desiredAnnualWithdrawal')} ({t('fire.monthly')})
                  </p>
                  <div className="amount-large text-gray-900 dark:text-white font-semibold">
                    {getSymbol()}{(annualWithdrawal / 12 || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('fire.monthly')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hero Section - FIRE Number */}
        {annualWithdrawal > 0 && (
          <>
            <div className="card p-8 md:p-12 mb-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('fire.heroSection.fireNumber')}
              </p>
              <p className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                {getSymbol()}{(fireNumber || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t('fire.heroSection.fireDesc')}</p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('fire.heroSection.monthlyWithdrawal')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {getSymbol()}{(monthlyWithdrawal || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('fire.progress.percentToGoal')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{percentToGoal.toFixed(0)}%</p>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t('fire.milestonesTitle')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MilestoneCard
                  title={t('fire.milestones.leanFire')}
                  amount={leanFire}
                  isActive={false}
                />
                <MilestoneCard
                  title={t('fire.milestones.standardFire')}
                  amount={fireNumber}
                  isActive={true}
                />
                <MilestoneCard
                  title={t('fire.milestones.fatFire')}
                  amount={fatFire}
                  isActive={false}
                />
              </div>
            </div>

            {/* Current Investments & Progress */}
            <div className="card p-6 md:p-8 mb-8">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t('fire.progress.progressTitle')}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('fire.progress.currentAmount')}
                  </label>
                  <input
                    type="number"
                    value={currentInvestments}
                    onChange={(e) => setCurrentInvestments(e.target.value)}
                    placeholder="0"
                    className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('fire.progress.targetAmount')}
                  </p>
                  <div className="amount-large text-gray-900 dark:text-white font-semibold">
                    {getSymbol()}{(fireNumber || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('fire.progress.progressTitle')}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{percentToGoal.toFixed(1)}%</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500"
                    style={{ width: `${percentToGoal}%` }}
                  />
                </div>
              </div>

              {currentAmount > 0 && fireNumber > currentAmount && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>{t('fire.progress.yearsToFire')}:</strong> {yearsToFire.toFixed(1)} {t('fire.progress.yearsToFire').toLowerCase().includes('yıl') ? '' : 'years'}
                  </p>
                </div>
              )}

              {currentAmount >= fireNumber && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                    🎉 {t('fire.milestone')}: {t('fire.milestones.standardFire')} {t('fire.progress.percentToGoal')} 100%!
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {annualWithdrawal === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">{t('fire.noData')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
