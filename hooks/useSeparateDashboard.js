/**
 * useSeparateDashboard Hook
 * Manages state and logic for the separate (two-person) mode dashboard
 */

import { useState, useEffect, useRef } from 'react';
import { PERSONAL_EXPENSE_CATEGORIES, SHARED_EXPENSE_CATEGORIES } from '../lib/constants';
import { loadFromCookie, saveToCookie } from '../lib/cookieStorage';

export function useSeparateDashboard(isInitialized = true, enabled = true) {
  // Person 1 state
  const [person1Incomes, setPerson1Incomes] = useState([]);
  const [person1Savings, setPerson1Savings] = useState('');
  const [person1Expenses, setPerson1Expenses] = useState(
    PERSONAL_EXPENSE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: '' }), {})
  );
  const [person1Name, setPerson1Name] = useState('Person 1');

  // Person 2 state
  const [person2Incomes, setPerson2Incomes] = useState([]);
  const [person2Savings, setPerson2Savings] = useState('');
  const [person2Expenses, setPerson2Expenses] = useState(
    PERSONAL_EXPENSE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: '' }), {})
  );
  const [person2Name, setPerson2Name] = useState('Person 2');

  // Shared expenses
  const [sharedExpenses, setSharedExpenses] = useState(
    SHARED_EXPENSE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: '' }), {})
  );

  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef(null);

  // Load data from cookies when enabled
  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const savedData = loadFromCookie('AUDIT_DASHBOARD_DATA');
    if (savedData) {
      if (savedData.person1Incomes) setPerson1Incomes(savedData.person1Incomes);
      if (savedData.person1Savings) setPerson1Savings(savedData.person1Savings);
      if (savedData.person1Expenses) setPerson1Expenses(savedData.person1Expenses);
      
      if (savedData.person2Incomes) setPerson2Incomes(savedData.person2Incomes);
      if (savedData.person2Savings) setPerson2Savings(savedData.person2Savings);
      if (savedData.person2Expenses) setPerson2Expenses(savedData.person2Expenses);

      if (savedData.sharedExpenses) setSharedExpenses(savedData.sharedExpenses);

      if (savedData.person1Name) setPerson1Name(savedData.person1Name);
      if (savedData.person2Name) setPerson2Name(savedData.person2Name);
    }
    setIsLoading(false);
  }, [enabled]);

  // Debounced save with calculationType preservation
  useEffect(() => {
    if (isLoading || !isInitialized || !enabled) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      const existingData = loadFromCookie('AUDIT_DASHBOARD_DATA') || {};
      saveToCookie('AUDIT_DASHBOARD_DATA', {
        ...existingData,
        person1Incomes,
        person1Savings,
        person1Expenses,
        person2Incomes,
        person2Savings,
        person2Expenses,
        sharedExpenses,
        person1Name,
        person2Name,
      }, 365);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [person1Incomes, person1Savings, person1Expenses, person2Incomes, person2Savings, person2Expenses, sharedExpenses, person1Name, person2Name, isLoading, isInitialized, enabled]);

  // Calculations for Person 1
  const person1Income = person1Incomes.reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
  const person1PersonalExpenses = Object.values(person1Expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const person1SavingsNum = parseFloat(person1Savings) || 0;

  // Calculations for Person 2
  const person2Income = person2Incomes.reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
  const person2PersonalExpenses = Object.values(person2Expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const person2SavingsNum = parseFloat(person2Savings) || 0;

  // Combined calculations
  const totalIncome = person1Income + person2Income;
  const sharedExpensesTotal = Object.values(sharedExpenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  // Income ratios
  const person1Ratio = totalIncome > 0 ? person1Income / totalIncome : 0.5;
  const person2Ratio = totalIncome > 0 ? person2Income / totalIncome : 0.5;

  // Contributions to shared account
  const person1Contribution = sharedExpensesTotal * person1Ratio;
  const person2Contribution = sharedExpensesTotal * person2Ratio;

  // Final balances
  const person1Balance = person1Income - person1SavingsNum - person1PersonalExpenses - person1Contribution;
  const person2Balance = person2Income - person2SavingsNum - person2PersonalExpenses - person2Contribution;
  const sharedBalance = person1Contribution + person2Contribution - sharedExpensesTotal;

  return {
    // Person 1 state
    person1Incomes,
    setPerson1Incomes,
    person1Savings,
    setPerson1Savings,
    person1Expenses,
    setPerson1Expenses,
    person1Name,
    setPerson1Name,

    // Person 2 state
    person2Incomes,
    setPerson2Incomes,
    person2Savings,
    setPerson2Savings,
    person2Expenses,
    setPerson2Expenses,
    person2Name,
    setPerson2Name,

    // Shared expenses
    sharedExpenses,
    setSharedExpenses,

    // Loading state
    isLoading,

    // Calculations
    person1Income,
    person1PersonalExpenses,
    person1SavingsNum,
    person1Ratio,
    person1Contribution,
    person1Balance,

    person2Income,
    person2PersonalExpenses,
    person2SavingsNum,
    person2Ratio,
    person2Contribution,
    person2Balance,

    totalIncome,
    sharedExpensesTotal,
    sharedBalance,
  };
}
