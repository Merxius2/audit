import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    const rate = (parseFloat(annualReturn) || 7) / 100 / 12; // Monthly rate

    let balance = 0;

    for (let age = current; age <= retirement; age++) {
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + rate) + monthly;
      }

      data.push({
        age,
        balance: Math.round(balance),
      });
    }

    return data;
  };

  const projectionData = generateProjection();
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;

  const currentAgeNum = parseInt(currentAge) || 0;
  const retirementAgeNum = parseInt(retirementAge) || 65;
  const yearsToRetirement = Math.max(0, retirementAgeNum - currentAgeNum);

  return (
    <div className="min-h-screen bg-dark-900 p-8 ml-64">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Retirement Projection</h1>
          <p className="text-white/60">Plan your financial future with compound growth projections</p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card">
            <label className="block text-sm font-semibold text-white/70 mb-3">
              Current Age
            </label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              placeholder="30"
              className="w-full text-2xl font-mono"
            />
          </div>

          <div className="glass-card">
            <label className="block text-sm font-semibold text-white/70 mb-3">
              Retirement Age
            </label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
              placeholder="65"
              className="w-full text-2xl font-mono"
            />
          </div>

          <div className="glass-card">
            <label className="block text-sm font-semibold text-white/70 mb-3">
              Monthly Investment
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              placeholder="1000"
              className="w-full text-2xl font-mono"
            />
          </div>

          <div className="glass-card">
            <label className="block text-sm font-semibold text-white/70 mb-3">
              Annual Return %
            </label>
            <input
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              placeholder="7"
              className="w-full text-2xl font-mono"
            />
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card mb-8">
          <h2 className="text-xl font-bold mb-6">Growth Projection</h2>
          {projectionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="age"
                  stroke="rgba(255,255,255,0.5)"
                  label={{ value: 'Age', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(9, 9, 11, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                  labelFormatter={(label) => `Age ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-white/50 text-center py-20">Enter valid ages to see projection</p>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card">
            <p className="text-white/60 text-sm mb-2">Years to Retirement</p>
            <p className="text-3xl font-bold">{yearsToRetirement}</p>
          </div>

          <div className="glass-card">
            <p className="text-white/60 text-sm mb-2">Total Contributions</p>
            <p className="text-3xl font-bold font-mono">
              ${(yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="glass-card">
            <p className="text-white/60 text-sm mb-2">Investment Gains</p>
            <p className="text-3xl font-bold font-mono text-green-400">
              ${(finalBalance - (yearsToRetirement * 12 * (parseFloat(monthlyInvestment) || 0))).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="glass-card bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <p className="text-white/60 text-sm mb-2">Total Estimated Wealth</p>
            <p className="text-3xl font-bold font-mono text-blue-300">
              ${finalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
