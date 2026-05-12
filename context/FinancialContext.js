import React, { createContext, useContext, useState } from 'react';

const FinancialContext = createContext();

const DEFAULT_MEDIANS = {
  '18-29': { income: 2500, savings: 500 },
  '30-44': { income: 3500, savings: 800 },
  '45-59': { income: 4000, savings: 1200 },
  '60+': { income: 3000, savings: 1500 },
};

export function FinancialProvider({ children }) {
  const [selectedAgeBracket, setSelectedAgeBracket] = useState('18-29');
  const [medianData, setMedianData] = useState(DEFAULT_MEDIANS);

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
