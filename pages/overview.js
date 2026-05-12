/**
 * Overview Page - Financial Summary Dashboard
 * Displays key metrics from all pages in a unified view
 */

import { useState, useEffect } from 'react';

import { Wallet, TrendingUp, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { loadFromCookie } from '../lib/cookieStorage';

const EXPENSE_CATEGORIES = ['House', 'Car', 'Food', 'Utilities', 'Healthcare', 'Leisure', 'Subscriptions', 'Phone', 'Insurance', 'Other'];
const CHART_COLORS = ['#EC4899', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#06B6D4', '#14B8A6', '#EF4444', '#06B6D4', '#8B5CF6'];

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

  const generateForwardProjection = (currentAge, retirementAge, monthlyInvestment, annualReturn) => {
    const current = parseInt(currentAge) || 0;
    const retirement = parseInt(retirementAge) || 65;
    const monthly = parseFloat(monthlyInvestment) || 0;
    const rate = (parseFloat(annualReturn) || 7) / 100 / 12;

    let balance = 0;
    for (let age = current; age < retirement; age++) {
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + rate) + monthly;
      }
    }

    const yearsElapsed = retirement - current;
    const totalContributions = yearsElapsed * 12 * monthly;
    const gains = Math.floor(balance - totalContributions);

    return {
      finalBalance: Math.floor(balance),
      contributions: Math.floor(totalContributions),
      gains: gains,
    };
  };

  const generateBackwardProjection = (currentAge, retirementAge, goalBalance, annualReturn) => {
    const current = parseInt(currentAge) || 0;
    const retirement = parseInt(retirementAge) || 65;
    const goal = parseFloat(goalBalance) || 500000;
    const rate = (parseFloat(annualReturn) || 7) / 100 / 12;
    const months = (retirement - current) * 12;

    // Calculate required monthly investment using the future value formula
    let requiredMonthly = 0;
    if (rate === 0) {
      requiredMonthly = months > 0 ? goal / months : 0;
    } else {
      const factor = (Math.pow(1 + rate, months) - 1) / rate;
      requiredMonthly = factor > 0 ? goal / factor : 0;
    }

    let balance = 0;
    for (let age = current; age < retirement; age++) {
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + rate) + requiredMonthly;
      }
    }

    const yearsElapsed = retirement - current;
    const totalContributions = yearsElapsed * 12 * requiredMonthly;
    const gains = Math.floor(balance - totalContributions);

    return {
      finalBalance: Math.floor(balance),
      contributions: Math.floor(totalContributions),
      gains: gains,
    };
  };

  useEffect(() => {
    // Load dashboard data from cookies
    const dashboardData = loadFromCookie('huishoudboekje_data');
    const retirementData = loadFromCookie('retirement_data');

    if (dashboardData) {
      const incomes = dashboardData.incomes || [];
      const totalIncome = incomes.reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
      const savingsAmount = parseFloat(dashboardData.savings) || 0;
      const expenses = dashboardData.expenses || {};

      const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

      let retirementBreakdown = { contributions: 0, gains: 0 };
      let monthlyInvest = 0;
      if (retirementData) {
        const isBackward = retirementData.calculationType === 'backward';
        const projection = isBackward
          ? generateBackwardProjection(
              retirementData.currentAge || '30',
              retirementData.retirementAge || '65',
              retirementData.goalBalance || '500000',
              retirementData.annualReturn || '7'
            )
          : generateForwardProjection(
              retirementData.currentAge || '30',
              retirementData.retirementAge || '65',
              retirementData.monthlyInvestment || '1000',
              retirementData.annualReturn || '7'
            );
        retirementBreakdown = {
          contributions: projection.contributions,
          gains: projection.gains,
        };
        
        // Calculate monthly investment
        if (isBackward) {
          const current = parseInt(retirementData.currentAge) || 0;
          const retirement = parseInt(retirementData.retirementAge) || 65;
          const goal = parseFloat(retirementData.goalBalance) || 500000;
          const rate = (parseFloat(retirementData.annualReturn) || 7) / 100 / 12;
          const months = (retirement - current) * 12;
          if (rate === 0) {
            monthlyInvest = months > 0 ? Math.floor(goal / months) : 0;
          } else {
            const factor = (Math.pow(1 + rate, months) - 1) / rate;
            monthlyInvest = factor > 0 ? Math.floor(goal / factor) : 0;
          }
        } else {
          monthlyInvest = Math.floor(parseFloat(retirementData.monthlyInvestment) || 0);
        }
      }

      setData({
        totalIncome,
        totalExpenses,
        savingsAmount,
        includeSavingsInCalculations: dashboardData.includeSavingsInCalculations !== false,
        expenses,
        retirementProjection: retirementData?.finalBalance || 0,
        retirementBreakdown,
        monthlyInvestment: monthlyInvest,
      });
    }
  }, []);

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
    <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Eye size={36} className="text-brand-primary" />
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Overview</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
        {/* Retirement Breakdown */}
        {data.retirementProjection > 0 && (
          <div className="card p-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Retirement Projection Breakdown</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
              <div className="rounded-2xl border border-gray-100 p-6 shadow-soft bg-gradient-to-br from-blue-50 to-white">
                <p className="text-sm font-medium text-gray-600">Your Contributions</p>
                <p className="amount-large mt-3 text-gray-900">
                  €{Math.floor(data.retirementBreakdown.contributions).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-6 shadow-soft bg-gradient-to-br from-green-50 to-white">
                <p className="text-sm font-medium text-gray-600">Investment Gains</p>
                <p className="amount-large mt-3 text-green-600">
                  €{Math.floor(data.retirementBreakdown.gains).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-6 shadow-soft bg-gradient-to-br from-purple-50 to-white">
                <p className="text-sm font-medium text-gray-600">Monthly Investment</p>
                <p className="amount-large mt-3 text-purple-600">
                  €{Math.floor(data.monthlyInvestment).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-6 shadow-soft bg-gradient-to-br from-brand-secondary/10 to-white">
                <p className="text-sm font-medium text-gray-600">Total Projected Balance</p>
                <p className="amount-large mt-3 text-brand-secondary">
                  €{Math.floor(data.retirementProjection).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Contributions</span>
                <span className="text-sm font-semibold text-gray-900">{((data.retirementBreakdown.contributions / data.retirementProjection) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(data.retirementBreakdown.contributions / data.retirementProjection) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-gray-700">Investment Gains</span>
                <span className="text-sm font-semibold text-gray-900">{((data.retirementBreakdown.gains / data.retirementProjection) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
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
            <p className="text-sm font-medium text-gray-600">Total Income</p>
            <p className="amount-large mt-3 text-gray-900">
              €{Math.floor(data.totalIncome).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>

          <div className="card-expenses p-6">
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="amount-large mt-3 text-gray-900">
              €{Math.floor(data.totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>

          <div className="card-savings p-6">
            <p className="text-sm font-medium text-gray-600">Savings Amount</p>
            <p className="amount-large mt-3 text-gray-900">
              €{Math.floor(data.savingsAmount).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-6 shadow-soft"
            style={{
              background: leftover >= 0
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)'
            }}>
            <p className="text-sm font-medium text-gray-600">Net Leftover</p>
            <p className={`amount-large mt-3 ${leftover >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              €{Math.floor(leftover).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Expense Ratio</p>
            <p className="amount-large mt-3 text-gray-900">{expenseRatio}%</p>
          </div>

          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Savings Rate</p>
            <p className="amount-large mt-3 text-gray-900">{savingsRate}%</p>
          </div>

          <div className="card p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Retirement Balance</p>
            <p className="amount-large mt-3 text-brand-secondary">
              €{Math.floor(data.retirementProjection || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Expense Breakdown Chart */}
        {data.totalIncome > 0 && (
          <div className="card p-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Expense Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: €${Math.floor(value).toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `€${Math.floor(value).toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Information Card */}
        <div className="card p-6 border-brand-primary/20 bg-brand-primary/5">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">💡 Tip:</span> This overview shows a summary of your financial data from all pages. Visit the Household Budget page to enter detailed income and expenses, or check Retirement to plan your financial future.
          </p>
        </div>
      </div>
    </div>
  );
}
