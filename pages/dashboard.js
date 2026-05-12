import { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import MedianBadge from '../components/MedianBadge';
import { DollarSign } from 'lucide-react';

const EXPENSE_CATEGORIES = ['House', 'Car', 'Food', 'Utilities', 'Healthcare', 'Leisure'];

export default function Dashboard() {
  const { getCurrentMedian } = useFinancial();
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
    <div className="min-h-screen bg-dark-900 p-8 ml-64">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Income & Expense Dashboard</h1>
          <p className="text-white/60">Track your monthly finances and compare with median values</p>
        </div>

        {/* Income Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card">
            <label className="block text-sm font-semibold text-white/70 mb-3">
              Monthly Net Income
            </label>
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="0"
                  className="w-full text-2xl font-mono"
                />
              </div>
              {incomeNum > 0 && (
                <MedianBadge value={incomeNum} median={currentMedian.income} />
              )}
            </div>
            <p className="text-xs text-white/50 mt-3">Median: ${currentMedian.income.toLocaleString()}</p>
          </div>

          <div className="glass-card">
            <label className="block text-sm font-semibold text-white/70 mb-3">
              Current Monthly Savings
            </label>
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                  placeholder="0"
                  className="w-full text-2xl font-mono"
                />
              </div>
              {savingsNum > 0 && (
                <MedianBadge value={savingsNum} median={currentMedian.savings} />
              )}
            </div>
            <p className="text-xs text-white/50 mt-3">Median: ${currentMedian.savings.toLocaleString()}</p>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="glass-card mb-8">
          <h2 className="text-xl font-bold mb-6">Monthly Expenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {EXPENSE_CATEGORIES.map((category) => (
              <div key={category}>
                <label className="block text-sm text-white/60 mb-2">{category}</label>
                <input
                  type="number"
                  value={expenses[category]}
                  onChange={(e) =>
                    setExpenses({ ...expenses, [category]: e.target.value })
                  }
                  placeholder="0"
                  className="w-full font-mono"
                />
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-white/10 pt-6 grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Total Expenses</p>
              <p className="text-3xl font-bold font-mono text-white">
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Monthly Income</p>
              <p className="text-3xl font-bold font-mono text-white">
                ${incomeNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className={`rounded-lg p-4 ${leftover >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <p className="text-white/60 text-sm mb-1">Net Leftover</p>
              <p className={`text-3xl font-bold font-mono ${leftover >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${leftover.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card">
            <p className="text-white/60 text-sm mb-2">Expense Ratio</p>
            <p className="text-2xl font-bold">
              {incomeNum > 0 ? ((totalExpenses / incomeNum) * 100).toFixed(1) : '0'}%
            </p>
          </div>

          <div className="glass-card">
            <p className="text-white/60 text-sm mb-2">Savings Rate</p>
            <p className="text-2xl font-bold">
              {incomeNum > 0 ? ((savingsNum / incomeNum) * 100).toFixed(1) : '0'}%
            </p>
          </div>

          <div className="glass-card">
            <p className="text-white/60 text-sm mb-2">Monthly Status</p>
            <p className={`text-2xl font-bold ${leftover >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {leftover >= 0 ? '✓ Balanced' : '✗ Deficit'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
