import { createContext, useContext, useState, useEffect } from 'react';
import { loadFromCookie, saveToCookie } from '../lib/cookieStorage';

const TaxContext = createContext();

// Netherlands Tax Brackets for different years
// Source: Belastingdienst (Dutch Tax Authority)
// IMPORTANT: Rates include both income tax AND mandatory social security contributions (premies volksverzekeringen)
const TAX_BRACKETS = {
  2024: [
    { min: 0, max: 69398, rate: 0.3735, label: '37.35%', description: 'Including social security' },
    { min: 69399, max: 187001, rate: 0.495, label: '49.50%', description: 'Including social security' },
    { min: 187002, max: Infinity, rate: 0.495, label: '49.50%', description: 'Including social security' },
  ],
  2025: [
    { min: 0, max: 73508, rate: 0.3735, label: '37.35%', description: 'Including social security' },
    { min: 73509, max: 198266, rate: 0.495, label: '49.50%', description: 'Including social security' },
    { min: 198267, max: Infinity, rate: 0.495, label: '49.50%', description: 'Including social security' },
  ],
  2026: [
    // NOTE: 2026 brackets are estimated based on inflation indexing
    // These are NOT YET SET by the Dutch government
    // Please verify and update when official rates are published
    { min: 0, max: 77885, rate: 0.3735, label: '37.35%', description: 'Including social security', isEstimated: true },
    { min: 77886, max: 211134, rate: 0.495, label: '49.50%', description: 'Including social security', isEstimated: true },
    { min: 211135, max: Infinity, rate: 0.495, label: '49.50%', description: 'Including social security', isEstimated: true },
  ],
};

// General tax credit (Algemene Heffingskorting) - annual values
const GENERAL_TAX_CREDITS = {
  2024: 2921,
  2025: 2921,
  2026: 2921,
};

// Earned Income Credit (Arbeidskorting) - annual values
// Decreasing credit system based on income level
const EARNED_INCOME_CREDITS = {
  2024: { maxCredit: 5098, phaseOutStart: 30825, phaseOutRate: 0.0629 },
  2025: { maxCredit: 5098, phaseOutStart: 30825, phaseOutRate: 0.0629 },
  2026: { maxCredit: 5098, phaseOutStart: 30825, phaseOutRate: 0.0629 },
};

export function TaxProvider({ children }) {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [taxBrackets, setTaxBrackets] = useState(TAX_BRACKETS[2025]);
  const [filingStatus, setFilingStatus] = useState('single');
  const [isLoading, setIsLoading] = useState(true);

  // Load tax preferences from cookies on mount
  useEffect(() => {
    const savedPreferences = loadFromCookie('tax_preferences');
    if (savedPreferences?.selectedYear) {
      setSelectedYear(savedPreferences.selectedYear);
      setTaxBrackets(TAX_BRACKETS[savedPreferences.selectedYear] || TAX_BRACKETS[2025]);
    }
    if (savedPreferences?.filingStatus) {
      setFilingStatus(savedPreferences.filingStatus);
    }
    setIsLoading(false);
  }, []);

  const changeYear = (year) => {
    setSelectedYear(year);
    setTaxBrackets(TAX_BRACKETS[year] || TAX_BRACKETS[2025]);
    saveToCookie('tax_preferences', { 
      selectedYear: year, 
      filingStatus: filingStatus 
    }, 365);
  };

  const changeFilingStatus = (status) => {
    setFilingStatus(status);
    saveToCookie('tax_preferences', { 
      selectedYear: selectedYear, 
      filingStatus: status 
    }, 365);
  };

  const updateTaxBrackets = (year, newBrackets) => {
    TAX_BRACKETS[year] = newBrackets;
    if (year === selectedYear) {
      setTaxBrackets(newBrackets);
    }
  };

  const getGeneralTaxCredit = () => {
    return GENERAL_TAX_CREDITS[selectedYear] || GENERAL_TAX_CREDITS[2025];
  };

  const getEarnedIncomeCredit = () => {
    return EARNED_INCOME_CREDITS[selectedYear] || EARNED_INCOME_CREDITS[2025];
  };

  const isEstimatedYear = () => {
    return TAX_BRACKETS[selectedYear]?.some(bracket => bracket.isEstimated) || false;
  };

  return (
    <TaxContext.Provider value={{
      selectedYear,
      changeYear,
      filingStatus,
      changeFilingStatus,
      taxBrackets,
      updateTaxBrackets,
      getGeneralTaxCredit,
      getEarnedIncomeCredit,
      isEstimatedYear,
      TAX_BRACKETS,
      isLoading,
    }}>
      {children}
    </TaxContext.Provider>
  );
}

export function useTax() {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTax must be used within TaxProvider');
  }
  return context;
}
