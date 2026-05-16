/**
 * Expense Calculator Utilities
 * Handles aggregation and calculations of expenses across shared and separate modes
 */

import { EXPENSE_CATEGORIES } from './constants';

/**
 * Aggregate expenses from different modes and sources
 * @param {number} sharedExpense - Total shared expense amount (in shared mode)
 * @param {number} separateExpense1 - First person's separate expenses
 * @param {number} separateExpense2 - Second person's separate expenses
 * @param {boolean} inSharedMode - Whether to use shared mode aggregation
 * @returns {number} Total aggregated expense amount
 */
export function aggregateExpenses(sharedExpense, separateExpense1, separateExpense2, inSharedMode) {
  if (inSharedMode) {
    return Math.max(0, (parseFloat(sharedExpense) || 0));
  }
  
  const exp1 = Math.max(0, (parseFloat(separateExpense1) || 0));
  const exp2 = Math.max(0, (parseFloat(separateExpense2) || 0));
  return exp1 + exp2;
}

/**
 * Merge expenses from separate mode into unified object
 * @param {object} person1Expenses - First person's expense object {category: amount}
 * @param {object} person2Expenses - Second person's expense object {category: amount}
 * @param {object} sharedExpenses - Shared expenses object {category: amount}
 * @returns {object} Merged expense object with all categories
 */
export function mergeExpensesFromSeparateMode(person1Expenses = {}, person2Expenses = {}, sharedExpenses = {}) {
  const merged = {};
  
  EXPENSE_CATEGORIES.forEach(cat => {
    const p1 = parseFloat(person1Expenses[cat]) || 0;
    const p2 = parseFloat(person2Expenses[cat]) || 0;
    const shared = parseFloat(sharedExpenses[cat]) || 0;
    merged[cat] = p1 + p2 + shared;
  });
  
  return merged;
}

/**
 * Calculate total expenses from an expense object
 * @param {object} expenses - Expense object {category: amount}
 * @returns {number} Total expense amount
 */
export function calculateTotalExpenses(expenses = {}) {
  return Object.values(expenses).reduce((sum, val) => sum + Math.max(0, parseFloat(val) || 0), 0);
}

/**
 * Calculate shared expense contributions based on income ratio
 * @param {number} sharedExpensesTotal - Total shared expenses
 * @param {number} person1Income - Person 1's income
 * @param {number} person2Income - Person 2's income
 * @returns {object} {person1Contribution, person2Contribution} - Each person's share
 */
export function calculateSharedExpenseContributions(sharedExpensesTotal, person1Income, person2Income) {
  const total = Math.max(0, parseFloat(person1Income) || 0) + Math.max(0, parseFloat(person2Income) || 0);
  
  if (total === 0) {
    return { person1Contribution: 0, person2Contribution: 0 };
  }
  
  const person1Ratio = (parseFloat(person1Income) || 0) / total;
  const person2Ratio = (parseFloat(person2Income) || 0) / total;
  
  return {
    person1Contribution: sharedExpensesTotal * person1Ratio,
    person2Contribution: sharedExpensesTotal * person2Ratio,
  };
}
