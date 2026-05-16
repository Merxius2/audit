/**
 * PersonSection Component
 * Renders income, savings, and expenses section for one person in separate mode
 */

import { PiggyBank, Plus, Trash2 } from 'lucide-react';
import { PERSONAL_EXPENSE_CATEGORIES, CATEGORY_ICONS } from '../lib/constants';

export default function PersonSection({ 
  personLabel, 
  incomes, 
  setIncomes, 
  savings, 
  setSavings, 
  expenses, 
  setExpenses,
  getSymbol,
  t,
  isMobile,
  isPersonOne = true,
  contribution = 0,
  showContribution = false
}) {
  const addIncome = () => {
    const newId = Date.now().toString();
    setIncomes([...incomes, { id: newId, label: `${personLabel} Income ${incomes.length + 1}`, amount: '' }]);
  };

  const updateIncome = (id, field, value) => {
    setIncomes(incomes.map(income =>
      income.id === id ? { ...income, [field]: value } : income
    ));
  };

  const removeIncome = (id) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  const totalIncome = incomes.reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const savingsNum = parseFloat(savings) || 0;
  const balance = totalIncome - savingsNum - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Income Card */}
      <div className="card-income p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.income')}</h3>
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
      </div>

      {/* Personal Expenses */}
      <div className="card-expenses p-8">
        <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.expenses')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {PERSONAL_EXPENSE_CATEGORIES.map((category) => {
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

      {/* Summary and Contribution Breakdown Combined */}
      <div className="card p-6 border-l-4 border-brand-primary">
        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t('dashboard.summary')}</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.totalIncome')}</span>
            <span className="font-mono font-bold text-brand-primary">{getSymbol()}{Math.floor(totalIncome).toLocaleString('en-US')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.totalExpenses')}</span>
            <span className="font-mono font-bold text-red-600 dark:text-red-400">-{getSymbol()}{Math.floor(totalExpenses).toLocaleString('en-US')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.savingsAmount')}</span>
            <span className="font-mono font-bold text-gray-900 dark:text-gray-100">-{getSymbol()}{Math.floor(savingsNum).toLocaleString('en-US')}</span>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2 flex justify-between items-center text-sm font-medium">
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.balance')}</span>
            <span className={`font-mono ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{getSymbol()}{Math.floor(balance).toLocaleString('en-US')}</span>
          </div>

          {/* Contribution to Shared Account (shown in separate mode) */}
          {showContribution && (
            <>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{t('dashboard.contribution')}</span>
                <span className="font-mono font-bold text-gray-900 dark:text-gray-100">-{getSymbol()}{Math.floor(contribution).toLocaleString('en-US')}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2 flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">{t('dashboard.personalBalance')}</span>
                <span className={`font-mono text-lg font-bold ${(balance - contribution) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {getSymbol()}{Math.floor(balance - contribution).toLocaleString('en-US')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
