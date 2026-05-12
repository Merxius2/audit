/**
 * Dashboard Page - Income & Expense Tracking
 * Main page for tracking monthly finances with median comparisons
 */

import { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import MedianBadge from '../components/MedianBadge';
import { TrendingUp, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const EXPENSE_CATEGORIES = ['House', 'Car', 'Food', 'Utilities', 'Healthcare', 'Leisure'];
const CHART_COLORS = ['#EC4899', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#06B6D4', '#14B8A6'];

export default function Dashboard() {
  const { getCurrentMedian, selectedAgeBracket } = useFinancial();
  const currentMedian = getCurrentMedian();

  const [income, setIncome] = useState('');
  const [savings, setSavings] = useState('');
  const [expenses, setExpenses] = useState(
    EXPENSE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: '' }), {})
  );

  const totalExpenses = Object.values(expenses)
    .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  const incomeNum = parseFloat(income) || 0;
  const savingsNum = parseFloat(savings) || 0;
  const leftover = incomeNum - totalExpenses;

  return (
    <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0">
      {/* Header with Age Bracket Badge */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Dashboard</h1>
          <div className="mt-4 inline-flex items-center space-x-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <Wallet size={16} className="text-brand-primary" />
            <span className="text-sm font-semibold text-gray-700">Age: {selectedAgeBracket}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
        {/* Income & Savings Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Income Card */}
          <div className="card-income p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Monthly Net Income
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="0"
                  className="mt-3 amount-large w-full border-0 bg-transparent text-gray-900 focus:ring-0"
                />
              </div>
              {incomeNum > 0 && (
                <MedianBadge value={incomeNum} median={currentMedian.income} />
              )}
            </div>
          </div>

          {/* Savings Card */}
          <div className="card-savings p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Current Monthly Savings
                </label>
                <input
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                  placeholder="0"
                  className="mt-3 amount-large w-full border-0 bg-transparent text-gray-900 focus:ring-0"
                />
              </div>
              {savingsNum > 0 && (
                <MedianBadge value={savingsNum} median={currentMedian.savings} />
              )}
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="card-expenses p-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Monthly Expenses</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPENSE_CATEGORIES.map((category) => (
              <div key={category}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {category}
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
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card-summary p-6">
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="amount-large mt-2 text-gray-900">
              €{totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="card-summary p-6">
            <p className="text-sm font-medium text-gray-600">Monthly Income</p>
            <p className="amount-large mt-2 text-gray-900">
              €{incomeNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-6 shadow-soft"
            style={{
              background: leftover >= 0
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)'
            }}>
            <p className="text-sm font-medium text-gray-600">Net Leftover</p>
            <p className={`amount-large mt-2 ${leftover >= 0 ? 'glow-green text-green-600' : 'text-red-600'}`}>
              €{leftover.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Income vs Expenses Pie Chart */}
        {incomeNum > 0 && (
          <div className="card p-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Income vs Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    ...EXPENSE_CATEGORIES.map((cat) => ({
                      name: cat,
                      value: parseFloat(expenses[cat]) || 0
                    })).filter(item => item.value > 0),
                    { name: 'Remaining', value: Math.max(leftover, 0) }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: €${value.toLocaleString()}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    ...EXPENSE_CATEGORIES.map((cat) => ({
                      name: cat,
                      value: parseFloat(expenses[cat]) || 0
                    })).filter(item => item.value > 0),
                    { name: 'Remaining', value: Math.max(leftover, 0) }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `€${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Status Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Expense Ratio</p>
            <p className="amount-large mt-2 text-gray-900">
              {incomeNum > 0 ? ((totalExpenses / incomeNum) * 100).toFixed(1) : '0'}%
            </p>
          </div>

          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Savings Rate</p>
            <p className="amount-large mt-2 text-gray-900">
              {incomeNum > 0 ? ((savingsNum / incomeNum) * 100).toFixed(1) : '0'}%
            </p>
          </div>

          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Monthly Status</p>
            <p className={`amount-large mt-2 ${leftover >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {leftover >= 0 ? '✓ Balanced' : '✗ Deficit'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

