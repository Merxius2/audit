/**
 * FIRE Calculator Page
 * Calculate Financial Independence, Retire Early (FIRE) target
 * Using the 4% safe withdrawal rate rule
 */

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { loadFromCookie } from '../lib/cookieStorage';
import { applyExpenseCategoryOverrides, parseDashboardData } from '../lib/expenseCalculator';
import { useCurrency, useLanguage } from '../context/UserPreferencesContext';
import { useCookieStorage } from '../hooks/useCookieStorage';
import PageHeader from '../components/PageHeader';
import ModeToggle from '../components/ModeToggle';

export default function FIRECalculator() {
  const [importError, setImportError] = useState('');
  const [annualWithdrawal, setAnnualWithdrawal] = useState(0);

  const { getSymbol } = useCurrency();
  const { t } = useLanguage();

  const { data, isLoading, updateData } = useCookieStorage('AUDIT_FIRE_DATA', {
    mode: 'manual',
    desiredWithdrawal: '',
    currentInvestments: '',
    categoryOverrides: {},
  });

  const { mode, desiredWithdrawal, currentInvestments, categoryOverrides } = data;

  useEffect(() => {
    if (mode === 'manual') {
      setAnnualWithdrawal(parseFloat(desiredWithdrawal) || 0);
      setImportError('');
      return;
    }

    const dashboardData = loadFromCookie('AUDIT_DASHBOARD_DATA');
    const parsed = parseDashboardData(dashboardData);

    if (!parsed) {
      setImportError(t('fire.importFailed'));
      setAnnualWithdrawal(0);
      return;
    }

    const monthlyTotal = applyExpenseCategoryOverrides(
      parsed.monthlyExpenses,
      categoryOverrides,
      dashboardData
    );

    setImportError('');
    setAnnualWithdrawal(monthlyTotal * 12);
  }, [mode, desiredWithdrawal, categoryOverrides, t]);

  const fireNumber = annualWithdrawal * 25;
  const leanFire = fireNumber * 0.75;
  const fatFire = fireNumber * 1.25;
  const monthlyWithdrawal = (fireNumber * 0.04) / 12;
  const currentAmount = parseFloat(currentInvestments) || 0;
  const percentToGoal = fireNumber > 0 ? Math.min((currentAmount / fireNumber) * 100, 100) : 0;
  const yearsToFire = fireNumber > 0 && currentAmount < fireNumber
    ? Math.log(fireNumber / currentAmount) / Math.log(1.07)
    : 0;

  const MilestoneCard = ({ title, amount, description, isActive }) => (
    <div className={`card p-6 ${isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {getSymbol()}{(amount || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
      </p>
      {description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{description}</p>
      )}
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
          <ModeToggle
            label={`${t('fire.modes.manual')} / ${t('fire.modes.dynamic')}`}
            options={[
              { id: 'manual', label: t('fire.modes.manual') },
              { id: 'dynamic', label: t('fire.modes.dynamic') },
            ]}
            value={mode}
            onChange={(id) => { updateData('mode', id); if (id === 'manual') setImportError(''); }}
          />
        </div>

        {/* Manual / Dynamic Input */}
        <div className="card p-6 md:p-8 mb-8">
          {mode === 'manual' ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('fire.desiredAnnualWithdrawal')}
                  </label>
                  <input
                    type="number"
                    value={desiredWithdrawal}
                    onChange={(e) => updateData('desiredWithdrawal', e.target.value)}
                    placeholder="0"
                    className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('fire.formula')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('fire.progress.currentAmount')}
                  </label>
                  <input
                    type="number"
                    value={currentInvestments}
                    onChange={(e) => updateData('currentInvestments', e.target.value)}
                    placeholder="0"
                    className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('fire.progress.currentAmount')}</p>
                </div>
              </div>
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
                  description={t('fire.milestones.leanFireDesc')}
                  amount={leanFire}
                  isActive={false}
                />
                <MilestoneCard
                  title={t('fire.milestones.standardFire')}
                  description={t('fire.milestones.standardFireDesc')}
                  amount={fireNumber}
                  isActive={true}
                />
                <MilestoneCard
                  title={t('fire.milestones.fatFire')}
                  description={t('fire.milestones.fatFireDesc')}
                  amount={fatFire}
                  isActive={false}
                />
              </div>
            </div>

            {/* Current Investments & Progress */}
            <div className="card p-6 md:p-8 mb-8">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t('fire.progress.progressTitle')}</h3>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('fire.progress.targetAmount')}
                </p>
                <div className="amount-large text-gray-900 dark:text-white font-semibold">
                  {getSymbol()}{(fireNumber || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
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
