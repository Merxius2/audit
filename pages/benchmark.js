/**
 * Wealth & Income Benchmark Page
 * Compare financial position with national and international medians
 */

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
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
  const [netIncome, setNetIncome] = useState('');
  const [totalAssets, setTotalAssets] = useState('');
  const [totalDebts, setTotalDebts] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
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
    }
    setIsLoading(false);
  }, []);

  // Debounced cookie save
  const debouncedSave = useDebouncedCookie('AUDIT_BENCHMARK_DATA', {
    netIncome,
    totalAssets,
    totalDebts,
  });

  useEffect(() => {
    if (!isLoading) {
      debouncedSave();
    }
  }, [netIncome, totalAssets, totalDebts, isLoading, debouncedSave]);

  const netWorth = (parseFloat(totalAssets) || 0) - (parseFloat(totalDebts) || 0);
  
  // Calculate percentile position vs benchmarks
  const incomeValue = parseFloat(netIncome) || 0;
  const wealthValue = netWorth;
  
  // Income percentile
  const incomePercentile = incomeValue > BENCHMARK_MEDIANS.international.income 
    ? 80 
    : incomeValue > BENCHMARK_MEDIANS.nl.income 
    ? 50 
    : 25;
  
  // Wealth percentile
  const wealthPercentile = wealthValue > BENCHMARK_MEDIANS.international.netWorth
    ? 80
    : wealthValue > BENCHMARK_MEDIANS.nl.netWorth
    ? 50
    : 25;

  const incomeVsMedian = incomeValue > BENCHMARK_MEDIANS.nl.income ? 'above' : 'below';
  const wealthVsMedian = wealthValue > BENCHMARK_MEDIANS.nl.netWorth ? 'above' : 'below';

  // Chart data
  const chartData = [
    {
      category: t('benchmark.income'),
      your: incomeValue,
      nl: BENCHMARK_MEDIANS.nl.income,
      intl: BENCHMARK_MEDIANS.international.income,
    },
    {
      category: t('benchmark.wealth'),
      your: wealthValue,
      nl: BENCHMARK_MEDIANS.nl.netWorth,
      intl: BENCHMARK_MEDIANS.international.netWorth,
    },
  ];

  const COLORS = ['#3B5BFF', '#10B981', '#F59E0B'];

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
              <input
                type="number"
                value={totalAssets}
                onChange={(e) => setTotalAssets(e.target.value)}
                placeholder="0"
                className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('benchmark.totalDebts')}
              </label>
              <input
                type="number"
                value={totalDebts}
                onChange={(e) => setTotalDebts(e.target.value)}
                placeholder="0"
                className="amount-large w-full border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0"
              />
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
                    dataKey="nl" 
                    name={t('benchmark.nlMedian')} 
                    fill={COLORS[1]}
                    label={renderCustomLabel}
                  />
                  <Bar 
                    dataKey="intl" 
                    name={t('benchmark.internationalMedian')} 
                    fill={COLORS[2]}
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
    </div>
  );
}
