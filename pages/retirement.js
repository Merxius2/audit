/**
 * Retirement Projection Page
 * Plan retirement with compound growth projections
 */

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function RetirementProjection() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [monthlyInvestment, setMonthlyInvestment] = useState('1000');
  const [annualReturn, setAnnualReturn] = useState('7');

  const generateProjection = () => {
    const data = [];
    const current = parseInt(currentAge) || 0;
    const retirement = parseInt(retirementAge) || 65;
    const monthly = parseFloat(monthlyInvestment) || 0;
    const rate = (parseFloat(annualReturn) || 7) / 100 / 12;

    let balance = 0;
    for (let age = current; age <= retirement; age++) {
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + rate) + monthly;
      }
      data.push({ age, balance: Math.round(balance) });
    }
    return data;
  };

  const projectionData = generateProjection();
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
  const currentAgeNum = parseInt(currentAge) || 0;
  const retirementAgeNum = parseInt(retirementAge) || 65;
  const yearsToRetirement = Math.max(0, retirementAgeNum - currentAgeNum);

  return (
    <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Retirement Projection</h1>
          <p className="mt-2 text-gray-600">Plan your financial future with compound growth</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
        {/* Input Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Current Age', value: currentAge, setValue: setCurrentAge, placeholder: '30' },
            { label: 'Retirement Age', value: retirementAge, setValue: setRetirementAge, placeholder: '65' },
            { label: 'Monthly Investment', value: monthlyInvestment, setValue: setMonthlyInvestment, placeholder: '1000' },
            { label: 'Annual Return %', value: annualReturn, setValue: setAnnualReturn, placeholder: '7' },
          ].map((field, idx) => (
            <div key={idx} className="card p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {field.label}
              </label>
              <input
                type="number"
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                placeholder={field.placeholder}
                className="amount-large w-full border-0 bg-transparent text-gray-900 focus:ring-0"
              />
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="card p-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Growth Projection</h2>
          {projectionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis
                  dataKey="age"
                  stroke="rgba(0,0,0,0.3)"
                  label={{ value: 'Age', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis
                  stroke="rgba(0,0,0,0.3)"
                  label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                  labelFormatter={(label) => `Age ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-20 text-gray-500">Enter valid ages to see projection</p>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-6">
            <p className="text-sm font-medium text-gray-600">Years to Retirement</p>
            <p className="amount-large mt-2 text-gray-900">{yearsToRetirement}</p>
          </div>

          <div className="card p-6">
            <p className="text-sm font-medium text-gray-600">Total Contributions</p>
            <p className="amount-large mt-2 text-gray-900 font-mono">
              ${(yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="card p-6">
            <p className="text-sm font-medium text-gray-600">Investment Gains</p>
            <p className="amount-large mt-2 text-green-600 font-mono">
              ${(finalBalance - (yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0))).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 p-6 shadow-soft">
            <p className="text-sm font-medium text-gray-600">Total Estimated Wealth</p>
            <p className="amount-large mt-2 text-brand-primary font-mono">
              ${finalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

