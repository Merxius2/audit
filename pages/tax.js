/**
 * Tax Calculator Page - Netherlands Income Tax Calculation
 * Calculate net from gross, gross from net, with detailed tax breakdown
 */

import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { saveToCookie, loadFromCookie } from '../lib/cookieStorage';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useSidebar } from '../context/SidebarContext';
import { useTax } from '../context/TaxContext';
import { calculateTaxBreakdown, calculateGrossFromNet } from '../lib/taxCalculator';
import { Menu, RotateCcw } from 'lucide-react';

export default function TaxCalculator() {
  // State
  const [calculationMode, setCalculationMode] = useState('gross-to-net');
  const [incomeInput, setIncomeInput] = useState('');
  const [isExpat, setIsExpat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const saveCookieTimeout = useRef(null);

  // Hooks
  const { getSymbol } = useCurrency();
  const { t } = useLanguage();
  const { toggleSidebar } = useSidebar();
  const { selectedYear, changeYear, taxBrackets, getTaxCredit, getSocialSecurityRate, isEstimatedYear } = useTax();

  // Detect mobile screen size
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load data from cookies on mount
  useEffect(() => {
    const savedData = loadFromCookie('tax_calculator_data');
    if (savedData) {
      if (savedData.incomeInput) setIncomeInput(savedData.incomeInput);
      if (savedData.calculationMode) setCalculationMode(savedData.calculationMode);
      if (savedData.isExpat !== undefined) setIsExpat(savedData.isExpat);
    }
    setIsLoading(false);
  }, []);

  // Save to cookie with debounce
  const debouncedSave = () => {
    if (saveCookieTimeout.current) {
      clearTimeout(saveCookieTimeout.current);
    }
    saveCookieTimeout.current = setTimeout(() => {
      saveToCookie('tax_calculator_data', {
        incomeInput,
        calculationMode,
        isExpat,
      }, 365);
    }, 500);
  };

  useEffect(() => {
    debouncedSave();
  }, [incomeInput, calculationMode, isExpat]);

  // Calculate taxes
  const calculateResults = () => {
    const income = parseFloat(incomeInput) || 0;
    if (income <= 0) {
      return null;
    }

    const taxCredit = getTaxCredit();
    const socialSecurityRate = getSocialSecurityRate();

    let result;
    if (calculationMode === 'gross-to-net') {
      result = calculateTaxBreakdown(income, taxBrackets, taxCredit, socialSecurityRate);
    } else {
      result = calculateGrossFromNet(income, taxBrackets, taxCredit, socialSecurityRate);
    }

    // Apply expat discount if enabled
    if (isExpat) {
      const discountedGross = result.grossIncome * 0.7;
      result = calculateTaxBreakdown(discountedGross, taxBrackets, taxCredit, socialSecurityRate);
      result.expatDiscountApplied = true;
      result.expatDiscountAmount = result.grossIncome * 0.4286; // 30% of original
      result.originalGrossIncome = result.grossIncome / 0.7;
    }

    return result;
  };

  const result = calculateResults();

  // Format chart data
  const chartData = result ? [
    {
      name: 'Breakdown',
      income: result.grossIncome,
      incomeTax: result.incomeTax,
      socialSecurity: result.socialSecurity,
    },
  ] : [];

  const handleReset = () => {
    setIncomeInput('');
    setCalculationMode('gross-to-net');
    setIsExpat(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 lg:ml-64">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('tax.title')}</h1>
          <div className="w-10" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">{t('tax.subtitle')}</p>
      </div>

      {/* Warning for estimated 2026 brackets */}
      {isEstimatedYear() && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ {t('tax.brackets2026Warning')}
          </p>
        </div>
      )}

      {/* Input Section */}
      <div className="card p-6 md:p-8 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('tax.calculationMode')}
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setCalculationMode('gross-to-net')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                calculationMode === 'gross-to-net'
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
              }`}
            >
              {t('tax.grossToNet')}
            </button>
            <button
              onClick={() => setCalculationMode('net-to-gross')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                calculationMode === 'net-to-gross'
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
              }`}
            >
              {t('tax.netToGross')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
          {/* Year Selector */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tax.year')}
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => changeYear(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026 ({t('tax.estimated')})</option>
            </select>
          </div>

          {/* Income Input */}
          <div>
            <label htmlFor="income" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {calculationMode === 'gross-to-net' ? t('tax.grossIncome') : t('tax.netIncome')}
            </label>
            <input
              id="income"
              type="number"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              min="0"
            />
          </div>
        </div>

        {/* Expat Discount Checkbox */}
        <div className="mb-6 flex items-center gap-3">
          <input
            id="expat"
            type="checkbox"
            checked={isExpat}
            onChange={(e) => setIsExpat(e.target.checked)}
            className="w-4 h-4 text-brand-primary bg-gray-100 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="expat" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            {t('tax.expatDiscount')} (30%)
          </label>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="mt-6 flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={18} />
          {t('tax.reset')}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            <div className="card p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {calculationMode === 'gross-to-net' ? t('tax.grossIncome') : t('tax.calculatedGross')}
              </p>
              <p className="font-mono text-2xl font-bold text-brand-primary">
                {getSymbol()}{Math.floor(result.grossIncome).toLocaleString('en-US')}
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('tax.totalTax')}</p>
              <p className="font-mono text-2xl font-bold text-red-600 dark:text-red-400">
                {getSymbol()}{Math.floor(result.totalTax).toLocaleString('en-US')}
              </p>
              <p className="text-xs text-gray-500 mt-1">{result.effectiveRate.toFixed(2)}% {t('tax.effectiveRate')}</p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {calculationMode === 'gross-to-net' ? t('tax.netIncome') : t('tax.calculatedNet')}
              </p>
              <p className="font-mono text-2xl font-bold text-green-600 dark:text-green-400">
                {getSymbol()}{Math.floor(result.netIncome).toLocaleString('en-US')}
              </p>
            </div>
          </div>

          {/* Tax Breakdown Chart */}
          <div className="card p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('tax.taxBreakdown')}</h2>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 280}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={isMobile ? { top: 10, right: 10, left: 20, bottom: 10 } : { top: 15, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" tick={false} width={0} />
                <Tooltip
                  formatter={(value) => `${getSymbol()}${Math.floor(value).toLocaleString('en-US')}`}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#f3f4f6',
                  }}
                />
                <Bar dataKey="incomeTax" stackId="a" fill="#ef4444" name={t('tax.incomeTax')} />
                <Bar dataKey="socialSecurity" stackId="a" fill="#f59e0b" name={t('tax.socialSecurity')} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('tax.incomeTax')}: {getSymbol()}{Math.floor(result.incomeTax).toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-amber-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('tax.socialSecurity')}: {getSymbol()}{Math.floor(result.socialSecurity).toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </div>

          {/* Tax Brackets Breakdown */}
          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('tax.taxBrackets')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-2 font-medium text-gray-700 dark:text-gray-300">{t('tax.range')}</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-700 dark:text-gray-300">{t('tax.rate')}</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-700 dark:text-gray-300">{t('tax.incomeInBracket')}</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-700 dark:text-gray-300">{t('tax.taxAmount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.bracketsBreakdown.map((bracket, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                        {getSymbol()}
                        {bracket.min.toLocaleString('en-US')} - {bracket.max === Infinity ? '∞' : `${getSymbol()}${bracket.max.toLocaleString('en-US')}`}
                      </td>
                      <td className="text-right px-4 py-2 text-gray-900 dark:text-gray-100">{bracket.label}</td>
                      <td className="text-right px-4 py-2 text-gray-900 dark:text-gray-100">
                        {getSymbol()}
                        {Math.floor(bracket.incomeInBracket).toLocaleString('en-US')}
                      </td>
                      <td className="text-right px-4 py-2 text-red-600 dark:text-red-400 font-medium">
                        {getSymbol()}
                        {Math.floor(bracket.taxInBracket).toLocaleString('en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expat Discount Info */}
          {result.expatDiscountApplied && (
            <div className="mt-8 card p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                {t('tax.expatDiscountInfo')}: {getSymbol()}{Math.floor(result.expatDiscountAmount).toLocaleString('en-US')}
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!result && !isLoading && (
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">{t('tax.noData')}</p>
        </div>
      )}
    </div>
  );
}
