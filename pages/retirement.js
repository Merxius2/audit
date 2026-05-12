/**
 * Retirement Projection Page
 * Plan retirement with compound growth projections
 */

import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { saveToCookie, loadFromCookie } from '../lib/cookieStorage';

export default function RetirementProjection() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [monthlyInvestment, setMonthlyInvestment] = useState('1000');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [isLoading, setIsLoading] = useState(true);
  const saveCookieTimeout = useRef(null);

  // Load data from cookies on mount
  useEffect(() => {
    const savedData = loadFromCookie('retirement_data');
    if (savedData) {
      if (savedData.currentAge) setCurrentAge(savedData.currentAge);
      if (savedData.retirementAge) setRetirementAge(savedData.retirementAge);
      if (savedData.monthlyInvestment) setMonthlyInvestment(savedData.monthlyInvestment);
      if (savedData.annualReturn) setAnnualReturn(savedData.annualReturn);
    }
    setIsLoading(false);
  }, []);

  // Save to cookie with debounce
  const debouncedSave = () => {
    if (saveCookieTimeout.current) {
      clearTimeout(saveCookieTimeout.current);
    }
    saveCookieTimeout.current = setTimeout(() => {
      const projectionData = generateProjection();
      const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
      saveToCookie('retirement_data', {
        currentAge,
        retirementAge,
        monthlyInvestment,
        annualReturn,
        finalBalance,
      });
    }, 500);
  };

  useEffect(() => {
    if (!isLoading) {
      debouncedSave();
    }
  }, [currentAge, retirementAge, monthlyInvestment, annualReturn, isLoading]);

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
      const yearsElapsed = age - current;
      const totalContributions = yearsElapsed * 12 * monthly;
      const gains = Math.round(balance - totalContributions);
      
      data.push({ 
        age, 
        balance: Math.round(balance),
        contributions: Math.round(totalContributions),
        gains: gains,
      });
    }
    return data;
  };

  const projectionData = generateProjection();
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
  const currentAgeNum = parseInt(currentAge) || 0;
  const retirementAgeNum = parseInt(retirementAge) || 65;
  const yearsToRetirement = Math.max(0, retirementAgeNum - currentAgeNum);

  if (isLoading) {
    return <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0" />;
  }

  return (
    <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={36} className="text-brand-secondary" />
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Retirement Projection</h1>
          </div>
          <p className="text-gray-600">Plan your financial future with compound growth</p>
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
                  label={{ value: 'Balance (€)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                          <p className="font-semibold text-gray-900 mb-3">Age {data.age}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Contributions:</span>
                              <span className="font-mono font-semibold text-gray-900">€{data.contributions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Investment Gains:</span>
                              <span className="font-mono font-semibold text-green-600">€{data.gains.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                              <span className="font-semibold text-gray-900">Total Balance:</span>
                              <span className="font-mono font-bold text-brand-primary">€{data.balance.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
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

        {/* Balance Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Breakdown */}
          <div className="card p-8">
            <h3 className="mb-6 text-lg font-bold text-gray-900">Balance Composition</h3>
            <div className="space-y-4">
              {/* Contributions Bar */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Your Contributions</span>
                  <span className="text-sm font-bold text-gray-900">
                    €{(yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all"
                    style={{
                      width: finalBalance > 0 
                        ? `${Math.min(100, ((yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0)) / finalBalance) * 100)}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>

              {/* Investment Gains Bar */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Investment Gains</span>
                  <span className="text-sm font-bold text-green-600">
                    €{(finalBalance - (yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0))).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                    style={{
                      width: finalBalance > 0 
                        ? `${Math.min(100, ((finalBalance - (yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0))) / finalBalance) * 100)}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>

              {/* Total Balance */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Balance</span>
                  <span className="amount-large text-brand-primary">
                    €{finalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="space-y-4">
            <div className="card p-6">
              <p className="text-sm font-medium text-gray-600">Years to Retirement</p>
              <p className="amount-large mt-2 text-gray-900">{yearsToRetirement}</p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-gray-600">Monthly Investment</p>
              <p className="amount-large mt-2 text-gray-900 font-mono">
                €{(parseFloat(monthlyInvestment) || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-gray-600">Total Contributions</p>
              <p className="amount-large mt-2 text-gray-900 font-mono">
                €{(yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-gray-600">Investment Gains</p>
              <p className="amount-large mt-2 text-green-600 font-mono">
                €{(finalBalance - (yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0))).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

