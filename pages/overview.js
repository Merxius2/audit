/**
 * Overview Page - Financial Summary Dashboard
 * Displays key metrics from all pages in a unified view
 */

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../lib/constants';
import { loadFromCookie } from '../lib/cookieStorage';
import { useCurrency, useLanguage } from '../context/UserPreferencesContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { parseDashboardData } from '../lib/expenseCalculator';
import { useRetirementMetrics } from '../hooks/useRetirementMetrics';
import PageHeader from '../components/PageHeader';
import DonutChart from '../components/DonutChart';

export default function Overview() {
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    savingsAmount: 0,
    includeSavingsInCalculations: true,
    expenses: {},
    retirementProjection: 0,
    retirementBreakdown: { contributions: 0, gains: 0 },
    monthlyInvestment: 0,
  });
  const { getSymbol } = useCurrency();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Load retirement metrics using dedicated hook
  const retirementMetrics = useRetirementMetrics();

  useEffect(() => {
    const parsed = parseDashboardData(loadFromCookie('AUDIT_DASHBOARD_DATA'));
    if (!parsed) return;

    setData({
      totalIncome: parsed.totalIncome,
      totalExpenses: parsed.totalExpenses,
      savingsAmount: parsed.savingsAmount,
      includeSavingsInCalculations: parsed.includeSavingsInCalculations,
      expenses: parsed.expenses,
      retirementProjection: retirementMetrics.retirementProjection,
      retirementBreakdown: retirementMetrics.retirementBreakdown,
      monthlyInvestment: retirementMetrics.monthlyInvestment,
    });
  }, [retirementMetrics]);

  const savingsRate = data.totalIncome > 0 
    ? ((data.savingsAmount / data.totalIncome) * 100).toFixed(1)
    : 0;

  const expenseRatio = data.totalIncome > 0
    ? ((data.totalExpenses / data.totalIncome) * 100).toFixed(1)
    : 0;

  const leftover = data.totalIncome - (data.includeSavingsInCalculations ? data.savingsAmount : 0) - data.totalExpenses;

  const pieData = [
    ...EXPENSE_CATEGORIES.map((cat) => ({
      name: cat,
      value: parseFloat(data.expenses[cat]) || 0
    })).filter(item => item.value > 0),
    { name: 'Remaining', value: Math.max(leftover, 0) }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-32 lg:ml-64 md:pb-0">
      <PageHeader icon={Eye} titleKey="overview.title" />

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
        {/* Retirement Breakdown */}
        {data.retirementProjection > 0 && (
          <div className="card p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">{t('overview.retirementProjectionBreakdown')}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-4 lg:p-5 shadow-soft bg-gradient-to-br from-blue-50 to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('overview.breakdown.contributions')}</p>
                <p className="amount-large mt-3 text-gray-900 dark:text-gray-100">
                  {getSymbol()}{Math.floor(data.retirementBreakdown.contributions).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-4 lg:p-5 shadow-soft bg-gradient-to-br from-green-50 to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('overview.breakdown.investmentGains')}</p>
                <p className="amount-large mt-3 text-green-600 dark:text-green-400">
                  {getSymbol()}{Math.floor(data.retirementBreakdown.gains).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-4 lg:p-5 shadow-soft bg-gradient-to-br from-purple-50 to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('overview.monthlyInvestment')}</p>
                <p className="amount-large mt-3 text-purple-600 dark:text-purple-400">
                  {getSymbol()}{Math.floor(data.monthlyInvestment).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-4 lg:p-5 shadow-soft bg-gradient-to-br from-brand-secondary/10 to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('overview.totalProjectedBalance')}</p>
                <p className="amount-large mt-3 text-brand-secondary dark:text-brand-secondary">
                  {getSymbol()}{Math.floor(data.retirementProjection).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">{t('overview.breakdown.contributions')}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{((data.retirementBreakdown.contributions / data.retirementProjection) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(data.retirementBreakdown.contributions / data.retirementProjection) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">{t('overview.breakdown.investmentGains')}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{((data.retirementBreakdown.gains / data.retirementProjection) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(data.retirementBreakdown.gains / data.retirementProjection) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-income p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('overview.cards.totalIncome')}</p>
            <p className="amount-large mt-3 text-gray-900 dark:text-gray-100">
              {getSymbol()}{Math.floor(data.totalIncome).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>

          <div className="card-expenses p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('overview.cards.totalExpenses')}</p>
            <p className="amount-large mt-3 text-gray-900 dark:text-gray-100">
              {getSymbol()}{Math.floor(data.totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>

          <div className="card-savings p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('overview.cards.savingsAmount')}</p>
            <p className="amount-large mt-3 text-gray-900 dark:text-gray-100">
              {getSymbol()}{Math.floor(data.savingsAmount).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-6 shadow-soft dark:border-gray-700"
            style={{
              background: leftover >= 0
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)'
            }}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('overview.cards.netLeftover')}</p>
            <p className={`amount-large mt-3 ${leftover >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {getSymbol()}{Math.floor(leftover).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Expense Ratio</p>
            <p className="amount-large mt-3 text-gray-900 dark:text-gray-100">{expenseRatio}%</p>
          </div>

          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">{t('overview.savingsRate')}</p>
            <p className="amount-large mt-3 text-gray-900 dark:text-gray-100">{savingsRate}%</p>
          </div>

          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">{t('overview.retirementBalance')}</p>
            <p className="amount-large mt-3 text-brand-secondary">
              {getSymbol()}{Math.floor(data.retirementProjection || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Expense Breakdown Donut Chart */}
        {data.totalIncome > 0 && (
          <div className="card p-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">{t('overview.expenseBreakdown')}</h2>
            <DonutChart 
              data={pieData}
              totalAmount={data.totalIncome}
              getSymbol={getSymbol}
              isMobile={isMobile}
              title="TOTAL"
              height={300}
            />
          </div>
        )}

        {/* Information Card */}
        <div className="card p-6 border-brand-primary/20 bg-brand-primary/5">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">💡 Tip:</span> {t('overview.tip')}
          </p>
        </div>
      </div>
    </div>
  );
}
