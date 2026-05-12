import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToCookie, loadFromCookie } from '../lib/cookieStorage';

const FinancialContext = createContext();

const DEFAULT_MEDIANS = {
  '18-29': { income: { min: 2200, max: 2500 }, savings: 500, wealth: { min: 300, max: 2500 } },
  '30-44': { income: { min: 2900, max: 3200 }, savings: 800, wealth: { min: 12000, max: 16000 } },
  '45-59': { income: { min: 3200, max: 3400 }, savings: 1200, wealth: { min: 25000, max: 32000 } },
  '60+': { income: { min: 2600, max: 3000 }, savings: 1500, wealth: { min: 35000, max: 45000 } },
};

export function FinancialProvider({ children }) {
  const [selectedAgeBracket, setSelectedAgeBracketState] = useState('18-29');
  const [medianData, setMedianData] = useState(DEFAULT_MEDIANS);
  const [isLoading, setIsLoading] = useState(true);

  // Load age bracket from cookies on mount
  useEffect(() => {
    const savedData = loadFromCookie('financial_context');
    if (savedData?.selectedAgeBracket) {
      setSelectedAgeBracketState(savedData.selectedAgeBracket);
    }
    setIsLoading(false);
  }, []);

  // Save age bracket to cookies when it changes
  const setSelectedAgeBracket = (bracket) => {
    setSelectedAgeBracketState(bracket);
    if (!isLoading) {
      saveToCookie('financial_context', { selectedAgeBracket: bracket });
    }
  };

  const updateMedianData = (ageBracket, field, value) => {
    setMedianData(prev => ({
      ...prev,
      [ageBracket]: {
        ...prev[ageBracket],
        [field]: value,
      },
    }));
  };

  const getMedianForBracket = (bracket) => medianData[bracket];
  const getCurrentMedian = () => medianData[selectedAgeBracket];

  return (
    <FinancialContext.Provider
      value={{
        selectedAgeBracket,
        setSelectedAgeBracket,
        medianData,
        setMedianData,
        updateMedianData,
        getMedianForBracket,
        getCurrentMedian,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within FinancialProvider');
  }
  return context;
}
