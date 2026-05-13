/**
 * Tax Calculator Page - Netherlands Income Tax Calculation
 * Calculate net from gross, gross from net, with detailed tax breakdown
 * Note: Income input is monthly; calculations are done on yearly basis and converted back to monthly
 */

import { useState, useEffect, useRef } from 'react';
import { saveToCookie, loadFromCookie } from '../lib/cookieStorage';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useSidebar } from '../context/SidebarContext';
import { useTax } from '../context/TaxContext';
import { calculateTaxBreakdown, calculateGrossFromNet } from '../lib/taxCalculator';
import { Menu, RotateCcw, Receipt } from 'lucide-react';

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
  const { selectedYear, changeYear, taxBrackets, getGeneralTaxCredit, getEarnedIncomeCredit, isEstimatedYear } = useTax();

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
    const monthlyIncome = parseFloat(incomeInput) || 0;
    if (monthlyIncome <= 0) {
      return null;
    }

    // Convert monthly to yearly for calculation
    let yearlyIncome = monthlyIncome * 12;
    let expatExemption = 0;
    const exemptionCap = 244000; // 2026 income cap for 30% rule (Balkenende-norm)

    const generalTaxCredit = getGeneralTaxCredit();
    const earnedIncomeCredit = getEarnedIncomeCredit();

    let result;
    if (calculationMode === 'gross-to-net') {
      // GROSS-TO-NET: Apply 30% expat exemption to the GROSS income before calculation
      let grossIncome = yearlyIncome;
      if (isExpat && grossIncome <= exemptionCap) {
        // 30% of income is tax-free
        expatExemption = grossIncome * 0.3;
        // Taxable income is only 70% of gross
        grossIncome = grossIncome * 0.7;
      } else if (isExpat && grossIncome > exemptionCap) {
        // For incomes above cap, no exemption applies
        expatExemption = 0;
      }
      result = calculateTaxBreakdown(grossIncome, taxBrackets, generalTaxCredit, earnedIncomeCredit);
    } else {
      // NET-TO-GROSS: Pass applyExpatExemption flag to binary search
      // This ensures correct gross is found that yields desired net income
      result = calculateGrossFromNet(yearlyIncome, taxBrackets, generalTaxCredit, earnedIncomeCredit, isExpat);
    }

    // Add expatExemption back to net income (it's tax-free) - only for gross-to-net
    // For net-to-gross, expatExemption is already handled in calculateGrossFromNet
    if (calculationMode === 'gross-to-net' && isExpat && expatExemption > 0) {
      result.expatExemption = expatExemption;
      result.netIncome = result.netIncome + expatExemption;
      result.effectiveRate = result.grossIncome + expatExemption > 0 
        ? ((result.totalTax) / (result.grossIncome + expatExemption)) * 100 
        : 0;
    }

    // Convert yearly results back to monthly
    return {
      ...result,
      grossIncome: (result.grossIncome + (expatExemption || 0)) / 12,
      incomeTax: result.incomeTax / 12,
      generalTaxCredit: result.generalTaxCredit / 12,
      earnedIncomeCreditAmount: result.earnedIncomeCreditAmount / 12,
      totalCredits: result.totalCredits / 12,
      totalTax: result.totalTax / 12,
      netIncome: result.netIncome / 12,
      expatExemption: (expatExemption || 0) / 12,
      bracketsBreakdown: result.bracketsBreakdown.map(b => ({
        ...b,
        incomeInBracket: b.incomeInBracket / 12,
        taxInBracket: b.taxInBracket / 12,
        cumulativeTax: b.cumulativeTax / 12,
      })),
    };
  };

  const result = calculateResults();

  const handleReset = () => {
    setIncomeInput('');
    setCalculationMode('gross-to-net');
    setIsExpat(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 lg:ml-64 md:pb-0">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={toggleSidebar}
              className="max-md:hidden lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
            <Receipt size={36} className="text-brand-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">{t('tax.title')}</h1>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{t('tax.subtitle')}</p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">

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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setCalculationMode('gross-to-net')}
              className={`flex-1 px-2 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                calculationMode === 'gross-to-net'
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
              }`}
            >
              {t('tax.grossToNet')}
            </button>
            <button
              onClick={() => setCalculationMode('net-to-gross')}
              className={`flex-1 px-2 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
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
              {calculationMode === 'gross-to-net' ? t('tax.grossIncome') : t('tax.netIncome')} (Monthly)
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
          className="mt-6 w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={18} />
          {t('tax.reset')}
        </button>
      </div>
    </div>
  );
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('tax.monthly')}</p>
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

          {/* Tax Brackets Breakdown */}
          <div className="card p-4 md:p-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">{t('tax.taxBrackets')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 md:mb-4">({t('tax.monthlyBasis')})</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-2 md:px-4 py-1 md:py-2 font-medium text-gray-700 dark:text-gray-300">{t('tax.range')}</th>
                    <th className="text-right px-2 md:px-4 py-1 md:py-2 font-medium text-gray-700 dark:text-gray-300">{t('tax.rate')}</th>
                    <th className="text-right px-2 md:px-4 py-1 md:py-2 font-medium text-gray-700 dark:text-gray-300">{t('tax.incomeInBracket')}</th>
                    <th className="text-right px-2 md:px-4 py-1 md:py-2 font-medium text-gray-700 dark:text-gray-300">{t('tax.taxAmount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.bracketsBreakdown.map((bracket, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="px-2 md:px-4 py-1 md:py-2 text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                        {getSymbol()}
                        {Math.floor(bracket.min / 12).toLocaleString('en-US')} - {bracket.max === Infinity ? '∞' : `${getSymbol()}${Math.floor(bracket.max / 12).toLocaleString('en-US')}`}
                      </td>
                      <td className="text-right px-2 md:px-4 py-1 md:py-2 text-gray-900 dark:text-gray-100 text-xs">{bracket.label}<br /><span className="text-gray-500 text-xs">(incl. verzek.)</span></td>
                      <td className="text-right px-2 md:px-4 py-1 md:py-2 text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                        {getSymbol()}
                        {Math.floor(bracket.incomeInBracket).toLocaleString('en-US')}
                      </td>
                      <td className="text-right px-2 md:px-4 py-1 md:py-2 text-red-600 dark:text-red-400 font-medium text-xs md:text-sm">
                        {getSymbol()}
                        {Math.floor(bracket.taxInBracket).toLocaleString('en-US')}
                      </td>
                    </tr>
                  ))}
                  {/* Subtotal Before Credits */}
                  <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                    <td colSpan="3" className="px-2 md:px-4 py-1 md:py-2 text-gray-900 dark:text-gray-100 font-bold text-xs md:text-sm">
                      {t('tax.subtotalBeforeCredits')}
                    </td>
                    <td className="text-right px-2 md:px-4 py-1 md:py-2 text-red-600 dark:text-red-400 font-bold text-xs md:text-sm">
                      {getSymbol()}
                      {Math.floor(result.bracketsBreakdown.reduce((sum, b) => sum + b.taxInBracket, 0)).toLocaleString('en-US')}
                    </td>
                  </tr>
                  {/* General Tax Credit Row */}
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td colSpan="3" className="px-2 md:px-4 py-1 md:py-2 text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                      {t('tax.generalTaxCredit')}
                    </td>
                    <td className="text-right px-2 md:px-4 py-1 md:py-2 text-green-600 dark:text-green-400 font-medium text-xs md:text-sm">
                      -{getSymbol()}
                      {Math.floor(result.generalTaxCredit).toLocaleString('en-US')}
                    </td>
                  </tr>
                  {/* Earned Income Credit Row */}
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td colSpan="3" className="px-2 md:px-4 py-1 md:py-2 text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                      {t('tax.earnedIncomeCredit')}
                    </td>
                    <td className="text-right px-2 md:px-4 py-1 md:py-2 text-green-600 dark:text-green-400 font-medium text-xs md:text-sm">
                      -{getSymbol()}
                      {Math.floor(result.earnedIncomeCreditAmount).toLocaleString('en-US')}
                    </td>
                  </tr>
                  {/* Total Tax */}
                  <tr className="bg-blue-50 dark:bg-blue-900/20 font-bold">
                    <td colSpan="3" className="px-2 md:px-4 py-1 md:py-2 text-gray-900 dark:text-gray-100 text-xs md:text-sm">{t('tax.totalTax')}</td>
                    <td className="text-right px-2 md:px-4 py-1 md:py-2 text-blue-600 dark:text-blue-400 text-xs md:text-sm">
                      {getSymbol()}
                      {Math.floor(result.totalTax).toLocaleString('en-US')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Expat 30% Exemption Info */}
          {result.expatExemption > 0 && (
            <div className="mt-8 card p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-2">
                {t('tax.expatExemption30Percent')}
              </p>
              <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">
                {t('tax.taxFreeAmount')}: {getSymbol()}{Math.floor(result.expatExemption).toLocaleString('en-US')} {t('tax.monthly')}
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-300">
                {t('tax.expatExemptionNote')}
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
    </div>
  );
}
