import React, { createContext, useContext } from 'react';

const FinancialContext = createContext();

export function FinancialProvider({ children }) {
  return (
    <FinancialContext.Provider value={{}}>
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
