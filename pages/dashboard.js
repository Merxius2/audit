/**
 * Household Budget Page - Income & Expense Tracking
 * Main page for tracking monthly finances with median comparisons
 */

import { useState, useEffect, useRef } from 'react';
import { Wallet, Home, Car, UtensilsCrossed, Zap, Heart, Smile, Banknote, PiggyBank, Plus, Trash2, CreditCard, Phone, Shield, MoreHorizontal, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { saveToCookie, loadFromCookie } from '../lib/cookieStorage';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

const EXPENSE_CATEGORIES = ['House', 'Car', 'Food', 'Utilities', 'Healthcare', 'Leisure', 'Subscriptions', 'Phone', 'Insurance', 'Other'];
const CHART_COLORS = ['#EC4899', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#06B6D4', '#14B8A6', '#EF4444', '#8B5CF6', '#F97316'];

const CATEGORY_ICONS = {
  'House': Home,
  'Car': Car,
  'Food': UtensilsCrossed,
  'Utilities': Zap,
  'Healthcare': Heart,
  'Leisure': Smile,
  'Subscriptions': CreditCard,
  'Phone': Phone,
  'Insurance': Shield,
  'Other': MoreHorizontal
};

export default function Dashboard() {

  const [incomes, setIncomes] = useState([]);
  const [savings, setSavings] = useState('');
  const [includeSavingsInCalculations, setIncludeSavingsInCalculations] = useState(true);
  const [expenses, setExpenses] = useState(
    EXPENSE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: '' }), {})
  );
  const [isLoading, setIsLoading] = useState(true);
  const saveCookieTimeout = useRef(null);
  const { getSymbol } = useCurrency();
  const { t } = useLanguage();

  // Load data from cookies on mount
  useEffect(() => {
    const savedData = loadFromCookie('huishoudboekje_data');
    if (savedData) {
      if (savedData.incomes) setIncomes(savedData.incomes);
      if (savedData.savings) setSavings(savedData.savings);
      if (savedData.includeSavingsInCalculations !== undefined) {
        setIncludeSavingsInCalculations(savedData.includeSavingsInCalculations);
      }
      if (savedData.expenses) setExpenses(savedData.expenses);
    }
    setIsLoading(false);
  }, []);

  // Save to cookie with debounce
  const debouncedSave = () => {
    if (saveCookieTimeout.current) {
      clearTimeout(saveCookieTimeout.current);
    }
    saveCookieTimeout.current = setTimeout(() => {
      saveToCookie('huishoudboekje_data', {
        incomes,
        savings,
        includeSavingsInCalculations,
        expenses,
      });
    }, 500);
  };

  useEffect(() => {
    if (!isLoading) {
      debouncedSave();
    }
  }, [incomes, savings, includeSavingsInCalculations, expenses, isLoading]);

  // Calculate totals
  const totalIncome = incomes.reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
  const savingsNum = parseFloat(savings) || 0;
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  const leftover = totalIncome - (includeSavingsInCalculations ? savingsNum : 0) - totalExpenses;

  // Pie chart data and custom label
  const pieData = [
    ...EXPENSE_CATEGORIES.map((cat) => ({
      name: cat,
      value: parseFloat(expenses[cat]) || 0
    })).filter(item => item.value > 0),
    ...(includeSavingsInCalculations && savingsNum > 0 ? [{ name: 'Savings', value: savingsNum }] : []),
    { name: 'Remaining', value: Math.max(leftover, 0) }
  ];

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

  // Income management functions
  const addIncome = () => {
    const newId = Date.now().toString();
    setIncomes([...incomes, { id: newId, label: `Income ${incomes.length + 1}`, amount: '' }]);
  };

  const updateIncome = (id, field, value) => {
    setIncomes(incomes.map(income =>
      income.id === id ? { ...income, [field]: value } : income
    ));
  };

  const removeIncome = (id) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0" />;
  }

  return (
    <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0">
      {/* Header with Age Bracket Badge */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={36} className="text-brand-primary" />
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{t('dashboard.title')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
        {/* Income Sources Card */}
        <div className="card-income p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t('dashboard.incomeHeader')}</h2>
            <button
              onClick={addIncome}
              className="flex items-center gap-2 rounded-lg bg-brand-primary text-white px-4 py-2 font-medium hover:bg-brand-primary/90 transition-colors"
            >
              <Plus size={18} />
              {t('dashboard.addIncomeBtn')}
            </button>
          </div>

          <div className="space-y-4">
            {incomes.map((income) => (
              <div key={income.id} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <p className="text-sm">No income sources yet. Click "Add Income" to get started.</p>
            </div>
          )}
        </div>

        {/* Savings Card with Toggle */}
        <div className="card-savings p-6">
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSavingsInCalculations}
                onChange={(e) => setIncludeSavingsInCalculations(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-2 focus:ring-brand-primary/10"
              />
              <span className="text-sm font-semibold text-gray-700">{t('dashboard.includeSavingsInCalc')}</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
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
            <p className="text-xs text-gray-500 mt-2">
              {includeSavingsInCalculations 
                ? '✓ Savings will be subtracted from your leftover' 
                : '✗ Savings will not affect calculations'}
            </p>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="card-expenses p-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">{t('dashboard.subtitle')}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPENSE_CATEGORIES.map((category) => {
              const IconComponent = CATEGORY_ICONS[category];
              return (
                <div key={category}>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <IconComponent size={18} className="text-brand-primary" />
                    {t(`dashboard.expenseCategories.${category}`)}
                  </label>
                  <input
                    type="number"
                    value={expenses[category]}
                    onChange={(e) =>
                      setExpenses({ ...expenses, [category]: e.target.value })
                    }
                    placeholder="0"
                    className="amount w-full"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card-summary p-6">
            <p className="text-sm font-medium text-gray-600">{t('dashboard.totalIncome')}</p>
            <p className="amount-large mt-2 text-gray-900">
              {getSymbol()}{Math.floor(totalIncome).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>

          <div className="card-summary p-6">
            <p className="text-sm font-medium text-gray-600">{t('dashboard.totalExpenses')}</p>
            <p className="amount-large mt-2 text-gray-900">
              {getSymbol()}{Math.floor(totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-6 shadow-soft"
            style={{
              background: leftover >= 0
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)'
            }}>
            <p className="text-sm font-medium text-gray-600">{t('dashboard.netLeftover')}</p>
            <p className={`amount-large mt-2 ${leftover >= 0 ? 'glow-green text-green-600' : 'text-red-600'}`}>
              {getSymbol()}{Math.floor(leftover).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Income vs Expenses Pie Chart */}
        {totalIncome > 0 && (
          <div className="card p-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">{t('dashboard.expenseBreakdown')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${getSymbol()}${Math.floor(value).toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
                  labelFormatter={(label) => {
                    const item = pieData.find(p => p.name === label);
                    const percentage = totalPieValue > 0 ? ((item.value / totalPieValue) * 100).toFixed(1) : 0;
                    let displayLabel = label;
                    if (label === 'Savings') {
                      displayLabel = t('dashboard.savings');
                    } else if (label === 'Remaining') {
                      displayLabel = t('dashboard.remaining');
                    } else {
                      displayLabel = t(`dashboard.expenseCategories.${label}`);
                    }
                    return `${displayLabel}: ${percentage}%`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Status Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">{t('dashboard.expenseRatio')}</p>
            <p className="amount-large mt-2 text-gray-900">
              {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : '0'}%
            </p>
          </div>

          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">{t('dashboard.savingsRate')}</p>
            <p className="amount-large mt-2 text-gray-900">
              {totalIncome > 0 ? ((savingsNum / totalIncome) * 100).toFixed(1) : '0'}%
            </p>
          </div>

          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">{t('dashboard.monthlyStatus')}</p>
            <p className={`amount-large mt-2 ${leftover >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {leftover >= 0 ? t('dashboard.balanced') : t('dashboard.deficit')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

