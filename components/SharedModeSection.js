/**
 * SharedModeSection Component
 * Main content for shared (household) mode dashboard
 */

import { Plus, Trash2, PiggyBank } from 'lucide-react';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from '../lib/constants';
import DonutChart from './DonutChart';

export default function SharedModeSection({
  incomes,
  addIncome,
  updateIncome,
  removeIncome,
  savings,
  setSavings,
  includeSavingsInCalculations,
  setIncludeSavingsInCalculations,
  expenses,
  setExpenses,
  getSymbol,
  t,
  pieData,
  leftover,
  totalExpenses,
  totalIncome,
}) {
  const savingsNum = parseFloat(savings) || 0;
  const totalPieValue = pieData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomLabel = ({ name, value }) => {
    const percentage = totalPieValue > 0 ? ((value / totalPieValue) * 100).toFixed(1) : 0;
    let displayName = name;
    if (name === 'Savings') {
      displayName = t('dashboard.savings');
    } else if (name === 'Remaining') {
      displayName = t('dashboard.remaining');
    } else {
      displayName = t(`dashboard.expenseCategories.${name}`);
    }
    return `${displayName}: ${getSymbol()}${Math.floor(value).toLocaleString('en-US', { minimumFractionDigits: 0 })} (${percentage}%)`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
      {/* Income Sources Card */}
      <div className="card-income p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.incomeHeader')}</h2>
          <button
            onClick={addIncome}
            className="flex items-center gap-2 rounded-lg bg-brand-primary text-white px-4 py-2 font-medium hover:bg-brand-primary/90 transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus size={18} />
            {t('dashboard.addIncomeBtn')}
          </button>
        </div>

        <div className="space-y-4">
          {incomes.map((income) => (
            <div key={income.id} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  {t('dashboard.sourceLabel')}
                </label>
                <input
                  type="text"
                  value={income.label}
                  onChange={(e) => updateIncome(income.id, 'label', e.target.value)}
                  placeholder={t('dashboard.placeholder.salaryFreelance')}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  {t('dashboard.amount')} ({getSymbol()})
                </label>
                <input
                  type="number"
                  value={income.amount}
                  onChange={(e) => updateIncome(income.id, 'amount', e.target.value)}
                  placeholder={t('dashboard.placeholder.amount')}
                  className="amount w-full"
                />
              </div>
              <button
                onClick={() => removeIncome(income.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title={t('dashboard.removeIncome')}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {incomes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">{t('dashboard.noIncomeSources')}</p>
          </div>
        )}
      </div>

      {/* Savings Card */}
      <div className="card-savings p-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-100 mb-3">
          <PiggyBank size={18} className="text-brand-primary" />
          {t('dashboard.savingsAmount')}
        </label>
        <input
          type="number"
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
          placeholder={t('dashboard.placeholder.amount')}
          className="mt-3 amount-large w-full border-0 bg-transparent text-gray-900 focus:ring-0"
        />
        <label className="flex items-center gap-2 mt-4 text-sm text-gray-700 dark:text-gray-100">
          <input
            type="checkbox"
            checked={includeSavingsInCalculations}
            onChange={(e) => setIncludeSavingsInCalculations(e.target.checked)}
            className="rounded border-gray-300"
          />
          {t('dashboard.includeSavingsInCalculations')}
        </label>
      </div>

      {/* Expenses */}
      <div className="card-expenses p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('dashboard.expenses')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPENSE_CATEGORIES.map((category) => {
            const IconComponent = CATEGORY_ICONS[category];
            return (
              <div key={category} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-100">
                  <IconComponent size={16} className="text-brand-primary" />
                  {t(`dashboard.expenseCategories.${category}`)}
                </label>
                <input
                  type="number"
                  value={expenses[category] || ''}
                  onChange={(e) => setExpenses({ ...expenses, [category]: e.target.value })}
                  placeholder="0"
                  className="amount w-full"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('dashboard.totalIncome')}</p>
          <p className="font-mono text-3xl font-bold text-brand-primary">{getSymbol()}{Math.floor(totalIncome).toLocaleString('en-US')}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('dashboard.totalExpenses')}</p>
          <p className="font-mono text-3xl font-bold text-red-600 dark:text-red-400">-{getSymbol()}{Math.floor(totalExpenses).toLocaleString('en-US')}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('dashboard.remaining')}</p>
          <p className={`font-mono text-3xl font-bold ${leftover >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {getSymbol()}{Math.floor(leftover).toLocaleString('en-US')}
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      {totalPieValue > 0 && (
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('dashboard.breakdown')}</h2>
          <DonutChart
            data={pieData}
            totalAmount={totalPieValue}
            getSymbol={getSymbol}
            height={300}
            title="BREAKDOWN"
          />
        </div>
      )}
    </div>
  );
}
