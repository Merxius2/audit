/**
 * Settings Page - Benchmark Configuration
 * Edit global median values for each age bracket
 */

import { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { CheckCircle2 } from 'lucide-react';

const AGE_BRACKETS = ['18-29', '30-44', '45-59', '60+'];

export default function Settings() {
  const { medianData, updateMedianData } = useFinancial();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Benchmark Settings</h1>
          <p className="mt-2 text-gray-600">Edit median values for each age bracket</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8">
        {/* Table Card */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Age Bracket</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Median Monthly Income</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Median Monthly Savings</th>
                </tr>
              </thead>
              <tbody>
                {AGE_BRACKETS.map((bracket, index) => (
                  <tr
                    key={bracket}
                    className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">{bracket}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={medianData[bracket].income}
                        onChange={(e) =>
                          updateMedianData(bracket, 'income', parseFloat(e.target.value) || 0)
                        }
                        className="amount w-32 rounded-lg border border-gray-200 px-3 py-2 text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={medianData[bracket].savings}
                        onChange={(e) =>
                          updateMedianData(bracket, 'savings', parseFloat(e.target.value) || 0)
                        }
                        className="amount w-32 rounded-lg border border-gray-200 px-3 py-2 text-gray-900"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save Section */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Changes are applied immediately to all pages
            </p>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-2 font-semibold text-white shadow-soft transition-all hover:shadow-soft-md active:scale-95"
            >
              {saved ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="card mt-8 border-brand-primary/30 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 p-6">
          <h3 className="mb-3 text-lg font-bold text-gray-900">About Benchmark Data</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Median Monthly Income:</strong> Average net monthly income for the age bracket</li>
            <li>• <strong>Median Monthly Savings:</strong> Average monthly savings amount for the age bracket</li>
            <li>• These values are used to compare your income and savings on the Dashboard</li>
            <li>• Edit these values to reflect your local market data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

