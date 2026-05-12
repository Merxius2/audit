import { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { Save } from 'lucide-react';

const AGE_BRACKETS = ['18-29', '30-44', '45-59', '60+'];

export default function Settings() {
  const { medianData, updateMedianData } = useFinancial();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-900 p-8 ml-64">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Benchmark Settings</h1>
          <p className="text-white/60">Edit median values for each age bracket</p>
        </div>

        {/* Table */}
        <div className="glass-card mb-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-white/70 font-semibold">Age Bracket</th>
                <th className="px-6 py-4 text-left text-white/70 font-semibold">Median Monthly Income</th>
                <th className="px-6 py-4 text-left text-white/70 font-semibold">Median Monthly Savings</th>
              </tr>
            </thead>
            <tbody>
              {AGE_BRACKETS.map((bracket, index) => (
                <tr
                  key={bracket}
                  className={`border-b border-white/5 ${
                    index % 2 === 0 ? 'bg-white/2' : ''
                  } hover:bg-white/5 transition-colors`}
                >
                  <td className="px-6 py-4 font-semibold">{bracket}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={medianData[bracket].income}
                      onChange={(e) =>
                        updateMedianData(bracket, 'income', parseFloat(e.target.value) || 0)
                      }
                      className="w-32 font-mono"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={medianData[bracket].savings}
                      onChange={(e) =>
                        updateMedianData(bracket, 'savings', parseFloat(e.target.value) || 0)
                      }
                      className="w-32 font-mono"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Save Button */}
          <div className="px-6 py-6 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/60 text-sm">
              Changes are applied immediately to all pages
            </p>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              <Save size={18} />
              <span>{saved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="glass-card bg-blue-500/10 border-blue-500/30">
          <h3 className="text-lg font-bold mb-3 text-blue-300">About Benchmark Data</h3>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>• Median Monthly Income: Average net monthly income for the age bracket</li>
            <li>• Median Monthly Savings: Average monthly savings amount for the age bracket</li>
            <li>• These values are used to compare your income and savings on the Dashboard</li>
            <li>• Edit these values to reflect your local market data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
