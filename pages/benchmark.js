/**
 * Wealth & Income Benchmark Page
 * Compare financial position with national and international medians
 */

import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Trash2, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BENCHMARK_MEDIANS } from '../lib/constants';
import { loadFromCookie, saveToCookie } from '../lib/cookieStorage';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useDebouncedCookie } from '../hooks/useDebouncedCookie';
import PageHeader from '../components/PageHeader';

export default function Benchmark() {
  // Default assets
  const DEFAULT_ASSETS = [
    { id: 1, name: 'House', amount: '', debt: '' },
    { id: 2, name: 'Car', amount: '', debt: '' },
    { id: 3, name: 'Phone', amount: '', debt: '' },
    { id: 4, name: 'Household Furniture', amount: '', debt: '' },
    { id: 5, name: 'Savings/Investments', amount: '', debt: '' },
  ];

  const [netIncome, setNetIncome] = useState('');
  const [totalAssets, setTotalAssets] = useState('');
  const [totalDebts, setTotalDebts] = useState('');
  const [ageGroup, setAgeGroup] = useState('30-40');
  const [education, setEducation] = useState('bachelor');
  const [isLoading, setIsLoading] = useState(true);
  const [isAssetsModalOpen, setIsAssetsModalOpen] = useState(false);
  const [assets, setAssets] = useState(DEFAULT_ASSETS);
  
  const { getSymbol } = useCurrency();
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const isMobile = useIsMobile();

  // Load from cookies on mount
  useEffect(() => {
    const savedData = loadFromCookie('AUDIT_BENCHMARK_DATA');
    if (savedData) {
      if (savedData.netIncome) setNetIncome(savedData.netIncome);
      if (savedData.totalAssets) setTotalAssets(savedData.totalAssets);
      if (savedData.totalDebts) setTotalDebts(savedData.totalDebts);
      if (savedData.ageGroup) setAgeGroup(savedData.ageGroup);
      if (savedData.education) setEducation(savedData.education);
      if (savedData.assets && savedData.assets.length > 0) {
        setAssets(savedData.assets);
      }
    }
    setIsLoading(false);
  }, []);

  // Debounced cookie save
  const debouncedSave = useDebouncedCookie('AUDIT_BENCHMARK_DATA', {
    netIncome,
    totalAssets,
    totalDebts,
    ageGroup,
    education,
    assets,
  });

  useEffect(() => {
    if (!isLoading) {
      debouncedSave();
    }
  }, [netIncome, totalAssets, totalDebts, ageGroup, education, assets, isLoading, debouncedSave]);

  // Calculate total assets from the assets list
  const calculateTotalAssets = (assetList) => {
    return assetList.reduce((sum, asset) => sum + (parseFloat(asset.amount) || 0), 0);
  };

  // Calculate total debt from assets
  const calculateTotalDebtFromAssets = (assetList) => {
    return assetList.reduce((sum, asset) => sum + (parseFloat(asset.debt) || 0), 0);
  };

  // Add new asset
  const addAsset = () => {
    setAssets([...assets, { id: Date.now(), name: '', amount: '', debt: '' }]);
  };

  // Remove asset
  const removeAsset = (id) => {
    const updatedAssets = assets.filter(asset => asset.id !== id);
    setAssets(updatedAssets);
  };

  // Update asset
  const updateAsset = (id, field, value) => {
    setAssets(assets.map(asset =>
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };

  // Save and close modal
  const saveAssets = () => {
    const total = calculateTotalAssets(assets);
    const debtTotal = calculateTotalDebtFromAssets(assets);
    setTotalAssets(total.toString());
    setTotalDebts(debtTotal.toString());
    setIsAssetsModalOpen(false);
  };

  // Get benchmark for selected age group and education
  const getBenchmarkForDemographic = () => {
    if (!ageGroup || !education) return null;
    const benchmarks = BENCHMARK_MEDIANS.byAgeAndEducation[ageGroup];
    return benchmarks ? benchmarks[education] : null;
  };

  const netWorth = (parseFloat(totalAssets) || 0) - (parseFloat(totalDebts) || 0);
  
  // Calculate percentile position vs benchmarks
  const incomeValue = parseFloat(netIncome) || 0;
  const wealthValue = netWorth;
  
  // Get appropriate benchmark
  const selectedBenchmark = getBenchmarkForDemographic() || BENCHMARK_MEDIANS.nl;
  
  // Income percentile
  const incomePercentile = incomeValue > selectedBenchmark.income * 1.5
    ? 90 
    : incomeValue > selectedBenchmark.income 
    ? 60 
    : incomeValue > selectedBenchmark.income * 0.5
    ? 30
    : 10;
  
  // Wealth percentile
  const wealthPercentile = wealthValue > selectedBenchmark.netWorth * 1.5
    ? 90
    : wealthValue > selectedBenchmark.netWorth
    ? 60
    : wealthValue > selectedBenchmark.netWorth * 0.5
    ? 30
    : 10;

  const incomeVsMedian = incomeValue > selectedBenchmark.income ? 'above' : 'below';
  const wealthVsMedian = wealthValue > selectedBenchmark.netWorth ? 'above' : 'below';

  // Chart data
  const chartData = [
    {
      category: t('benchmark.income'),
      your: incomeValue,
      median: selectedBenchmark.income,
    },
    {
      category: t('benchmark.wealth'),
      your: wealthValue,
      median: selectedBenchmark.netWorth,
    },
  ];

  const COLORS = ['#3B5BFF', '#10B981'];

  const formatValue = (value) => `${getSymbol()}${(value / 1000).toFixed(0)}k`;

  const renderCustomLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (!value) return null;
    
    const labelText = formatValue(value);
    const xPos = x + width / 2;
    const yPos = y - 10; // 10px above the bar
    
    return (
      <text
        x={xPos}
        y={yPos}
        fill={isDarkMode ? '#fff' : '#000'}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
      >
        {labelText}
      </text>
    );
  };

  const BadgeRanking = ({ label, percentile, vsMedian }) => {
    const isAbove = vsMedian === 'above';
    const badgeText = isAbove 
      ? t(`benchmark.badges.aboveMedian`) 
      : t(`benchmark.badges.belowMedian`);
    
    return (
      <div className="card p-6 mb-4">
        <p className="text-sm font-medium text-ink-soft mb-2">{label}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-ink">{percentile}%</p>
            <p className={`text-sm ${isAbove ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {badgeText}
            </p>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white ${
            isAbove ? 'bg-green-500' : 'bg-amber-500'
          }`}>
            {percentile}%
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white pb-32 lg:ml-64 md:pb-0" />;
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:ml-64 md:pb-0">
      <PageHeader icon={TrendingUp} titleKey="benchmark.title" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Input Section */}
        <div className="card p-6 md:p-8 mb-8">
          <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-gray-100">{t('benchmark.inputs')}</h3>
          
          {/* Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('benchmark.ageGroup')}
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('benchmark.education')}
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
              >
                <option value="highSchool">{t('benchmark.educationLevels.highSchool')}</option>
                <option value="bachelor">{t('benchmark.educationLevels.bachelor')}</option>
                <option value="master">{t('benchmark.educationLevels.master')}</option>
              </select>
            </div>
          </div>

          {/* Financial Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('benchmark.netAnnualIncome')}
              </label>
              <input
                type="number"
                value={netIncome}
                onChange={(e) => setNetIncome(e.target.value)}
                placeholder="0"
                className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('benchmark.totalAssets')}
              </label>
              <div className="flex gap-3">
                <div className="flex-1 amount-large text-gray-900 dark:text-white font-semibold">
                  {getSymbol()}{(parseFloat(totalAssets) || 0).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                </div>
                <button
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('benchmark.totalDebts')}
              </label>
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

        {/* Comparison Chart */}
        {(incomeValue > 0 || wealthValue > 0) && (
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
                  <Bar 
                    dataKey="your" 
                    name={t('benchmark.yourValue')} 
                    fill={COLORS[0]}
                    label={renderCustomLabel}
                  />
                  <Bar 
                    dataKey="median" 
                    name={t('benchmark.adjustedMedian')} 
                    fill={COLORS[1]}
                    label={renderCustomLabel}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rankings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t('benchmark.incomeRanking')}</h3>
                <BadgeRanking 
                  label={t('benchmark.income')}
                  percentile={incomePercentile}
                  vsMedian={incomeVsMedian}
                />
              </div>
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t('benchmark.wealthRanking')}</h3>
                <BadgeRanking
                  label={t('benchmark.wealth')}
                  percentile={wealthPercentile}
                  vsMedian={wealthVsMedian}
                />
              </div>
            </div>
          </>
        )}

        {incomeValue === 0 && wealthValue === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">{t('benchmark.noData')}</p>
          </div>
        )}
      </div>

      {/* Assets Modal */}
      {isAssetsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Breakdown of Assets</h2>
              <button
                onClick={() => setIsAssetsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {assets.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-sm">No assets added yet</p>
              ) : (
                assets.map((asset) => (
                  <div key={asset.id} className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <input
                      type="text"
                      placeholder="Asset name (e.g., House, Savings)"
                      value={asset.name}
                      onChange={(e) => updateAsset(asset.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Worth</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={asset.amount}
                          onChange={(e) => updateAsset(asset.id, 'amount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Debt</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={asset.debt}
                          onChange={(e) => updateAsset(asset.id, 'debt', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Net Value:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {getSymbol()}{((parseFloat(asset.amount) || 0) - (parseFloat(asset.debt) || 0)).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                ))
              )}

              {/* Totals */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total Assets</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {getSymbol()}{calculateTotalAssets(assets).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total Debt</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {getSymbol()}{calculateTotalDebtFromAssets(assets).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">Net Worth</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {getSymbol()}{(calculateTotalAssets(assets) - calculateTotalDebtFromAssets(assets)).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => addAsset()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus size={18} />
                Add Asset
              </button>
              <button
                onClick={saveAssets}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
