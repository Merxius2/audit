/**
 * useSharedDashboard Hook
 * Manages state and logic for the shared (household) mode dashboard
 */

import { useState, useEffect, useRef } from 'react';
import { EXPENSE_CATEGORIES } from '../lib/constants';
import { loadFromCookie, saveToCookie } from '../lib/cookieStorage';

export function useSharedDashboard(isInitialized = true) {
  // Shared mode state
  const [incomes, setIncomes] = useState([]);
  const [savings, setSavings] = useState('');
  const [includeSavingsInCalculations, setIncludeSavingsInCalculations] = useState(true);
  const [expenses, setExpenses] = useState(
    EXPENSE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: '' }), {})
  );
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef(null);

  // Load data from cookies on mount
  useEffect(() => {
    const savedData = loadFromCookie('AUDIT_DASHBOARD_DATA');
    if (savedData) {
      if (savedData.incomes) setIncomes(savedData.incomes);
      if (savedData.savings) setSavings(savedData.savings);
      if (savedData.includeSavingsInCalculations !== undefined) {
        setIncludeSavingsInCalculations(savedData.includeSavingsInCalculations);
      }
      if (savedData.expenses) setExpenses(savedData.expenses);
    }
    setIsLoading(false);
  }, []);

  // Debounced save with calculationType preservation
  // Only save after initialization is complete
  useEffect(() => {
    if (isLoading || !isInitialized) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      const existingData = loadFromCookie('AUDIT_DASHBOARD_DATA') || {};
      saveToCookie('AUDIT_DASHBOARD_DATA', {
        ...existingData,
        incomes,
        savings,
        includeSavingsInCalculations,
        expenses,
      }, 365);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [incomes, savings, includeSavingsInCalculations, expenses, isLoading, isInitialized]);

  // Income management functions
  const addIncome = () => {
    const newId = Date.now().toString();
    setIncomes([...incomes, { id: newId, label: `Income ${incomes.length + 1}`, amount: '' }]);
  };

  const updateIncome = (id, field, value) => {
    setIncomes(incomes.map(income =>
      income.id === id ? { ...income, [field]: value } : income
    ));
  };

  const removeIncome = (id) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  // Calculations
  const totalIncome = incomes.reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
  const savingsNum = parseFloat(savings) || 0;
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const leftover = totalIncome - (includeSavingsInCalculations ? savingsNum : 0) - totalExpenses;

  // Pie chart data
  const pieData = [
    ...EXPENSE_CATEGORIES.map((cat) => ({
      name: cat,
      value: parseFloat(expenses[cat]) || 0
    })).filter(item => item.value > 0),
    ...(includeSavingsInCalculations && savingsNum > 0 ? [{ name: 'Savings', value: savingsNum }] : []),
    { name: 'Remaining', value: Math.max(leftover, 0) }
  ];

  return {
    // State
    incomes,
    savings,
    includeSavingsInCalculations,
    expenses,
    isLoading,
    
    // Setters
    setIncomes,
    setSavings,
    setIncludeSavingsInCalculations,
    setExpenses,
    
    // Functions
    addIncome,
    updateIncome,
    removeIncome,
    
    // Calculations
    totalIncome,
    savingsNum,
    totalExpenses,
    leftover,
    pieData,
  };
}
