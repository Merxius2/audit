/**
 * Wealth & Income Benchmark Page
 * Compare financial position with national and international medians
 */

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BENCHMARK_MEDIANS } from '../lib/constants';
import {
  computePercentile,
  getBenchmarkForDemographic,
  sumAssetField,
  DEFAULT_BENCHMARK_ASSETS,
} from '../lib/benchmarkCalculator';
import { useCurrency, useLanguage, useDarkMode } from '../context/UserPreferencesContext';
import { useCookieStorage } from '../hooks/useCookieStorage';
import PageHeader from '../components/PageHeader';
import BenchmarkBadgeRanking from '../components/benchmark/BenchmarkBadgeRanking';
import AssetsModal from '../components/benchmark/AssetsModal';

const CHART_COLORS = ['#3B5BFF', '#10B981'];

function BarValueLabel({ isDarkMode, getSymbol }) {
  return function renderLabel(props) {
    const { x, y, width, value } = props;
    if (!value) return null;
    const labelText = `${getSymbol()}${(value / 1000).toFixed(0)}k`;
    return (
      <text x={x + width / 2} y={y - 10} fill={isDarkMode ? '#fff' : '#000'} textAnchor="middle" fontSize={12} fontWeight={600}>
        {labelText}
      </text>
    );
  };
}

export default function Benchmark() {
  const [isAssetsModalOpen, setIsAssetsModalOpen] = useState(false);

  const { getSymbol } = useCurrency();
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();

  const { data, isLoading, updateData } = useCookieStorage('AUDIT_BENCHMARK_DATA', {
    netIncome: '',
    totalAssets: '',
    totalDebts: '',
    ageGroup: '30-40',
    education: 'bachelor',
    assets: DEFAULT_BENCHMARK_ASSETS,
  });

  const { netIncome, totalAssets, totalDebts, ageGroup, education, assets } = data;

  const incomeValue = parseFloat(netIncome) || 0;
  const netWorth = (parseFloat(totalAssets) || 0) - (parseFloat(totalDebts) || 0);
  const selectedBenchmark = getBenchmarkForDemographic(ageGroup, education) || BENCHMARK_MEDIANS.nl;

  const incomePercentile = computePercentile(incomeValue, selectedBenchmark.income);
  const wealthPercentile = computePercentile(netWorth, selectedBenchmark.netWorth);
  const incomeVsMedian = incomeValue > selectedBenchmark.income ? 'above' : 'below';
  const wealthVsMedian = netWorth > selectedBenchmark.netWorth ? 'above' : 'below';

  const chartData = [
    { category: t('benchmark.income'), your: incomeValue, median: selectedBenchmark.income },
    { category: t('benchmark.wealth'), your: netWorth, median: selectedBenchmark.netWorth },
  ];

  const formatValue = (value) => `${getSymbol()}${(value / 1000).toFixed(0)}k`;
  const renderCustomLabel = BarValueLabel({ isDarkMode, getSymbol });

  const saveAssets = () => {
    updateData(null, {
      ...data,
      totalAssets: sumAssetField(assets, 'amount').toString(),
      totalDebts: sumAssetField(assets, 'debt').toString(),
    });
    setIsAssetsModalOpen(false);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white lg:ml-64" />;
  }

  return (
    <div className="min-h-screen bg-white lg:ml-64">
      <PageHeader icon={TrendingUp} titleKey="benchmark.title" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="card p-6 md:p-8 mb-8">
          <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-gray-100">{t('benchmark.inputs')}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('benchmark.ageGroup')}</label>
              <select
                value={ageGroup}
                onChange={(e) => updateData('ageGroup', e.target.value)}
                className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
              >
                <option value="20-30">{t('benchmark.ageGroups.20-30')}</option>
                <option value="30-40">{t('benchmark.ageGroups.30-40')}</option>
                <option value="40-50">{t('benchmark.ageGroups.40-50')}</option>
                <option value="50-60">{t('benchmark.ageGroups.50-60')}</option>
                <option value="60+">{t('benchmark.ageGroups.60+')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('benchmark.education')}</label>
              <select
                value={education}
                onChange={(e) => updateData('education', e.target.value)}
                className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
              >
                <option value="highSchool">{t('benchmark.educationLevels.highSchool')}</option>
                <option value="bachelor">{t('benchmark.educationLevels.bachelor')}</option>
                <option value="master">{t('benchmark.educationLevels.master')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('benchmark.netAnnualIncome')}</label>
              <input
                type="number"
                value={netIncome}
                onChange={(e) => updateData('netIncome', e.target.value)}
                placeholder="0"
                className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('benchmark.totalAssets')}</label>
              <div className="flex gap-3">
                <div className="flex-1 amount-large text-gray-900 dark:text-white font-semibold">
                  {getSymbol()}{(parseFloat(totalAssets) || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssetsModalOpen(true)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  Edit assets
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('benchmark.totalDebts')}</label>
              <div className="amount-large text-gray-900 dark:text-white font-semibold">
                {getSymbol()}{(parseFloat(totalDebts) || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Calculated from asset debts</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('benchmark.netWorth')} ({t('benchmark.netWorthDesc')})
              </label>
              <div className="amount-large text-gray-900 dark:text-white font-semibold">
                {getSymbol()}{(netWorth || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        </div>

        {(incomeValue > 0 || netWorth > 0) && (
          <>
            <div className="card p-6 md:p-8 mb-8">
              <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-gray-100">{t('benchmark.comparison')}</h3>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.3)" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={formatValue} />
                  <Tooltip
                    formatter={(value) => `${getSymbol()}${(value || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}`}
                    contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="your" name={t('benchmark.yourValue')} fill={CHART_COLORS[0]} label={renderCustomLabel} />
                  <Bar dataKey="median" name={t('benchmark.adjustedMedian')} fill={CHART_COLORS[1]} label={renderCustomLabel} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t('benchmark.incomeRanking')}</h3>
                <BenchmarkBadgeRanking label={t('benchmark.income')} percentile={incomePercentile} vsMedian={incomeVsMedian} t={t} />
              </div>
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t('benchmark.wealthRanking')}</h3>
                <BenchmarkBadgeRanking label={t('benchmark.wealth')} percentile={wealthPercentile} vsMedian={wealthVsMedian} t={t} />
              </div>
            </div>
          </>
        )}

        {incomeValue === 0 && netWorth === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">{t('benchmark.noData')}</p>
          </div>
        )}
      </div>

      {isAssetsModalOpen && (
        <AssetsModal
          assets={assets}
          onUpdate={(id, field, value) => updateData('assets', assets.map((a) => (a.id === id ? { ...a, [field]: value } : a)))}
          onAdd={() => updateData('assets', [...assets, { id: Date.now(), name: '', amount: '', debt: '' }])}
          onRemove={(id) => updateData('assets', assets.filter((a) => a.id !== id))}
          onSave={saveAssets}
          onClose={() => setIsAssetsModalOpen(false)}
          getSymbol={getSymbol}
        />
      )}
    </div>
  );
}
