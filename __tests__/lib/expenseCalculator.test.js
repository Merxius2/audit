/**
 * Expense Calculator Tests
 * Tests for expense aggregation and contribution calculations
 */

describe('Expense Calculator', () => {
  const {
    aggregateExpenses,
    mergeExpensesFromSeparateMode,
    calculateTotalExpenses,
    calculateSharedExpenseContributions,
    parseDashboardData,
    applyExpenseCategoryOverrides,
  } = require('../lib/expenseCalculator');

  describe('aggregateExpenses', () => {
    it('should return shared expense in shared mode', () => {
      const result = aggregateExpenses(1000, 500, 600, true);
      expect(result).toBe(1000);
    });

    it('should sum separate expenses in separate mode', () => {
      const result = aggregateExpenses(1000, 500, 600, false);
      expect(result).toBe(1100);
    });

    it('should handle negative values', () => {
      const result = aggregateExpenses(-100, -50, -60, true);
      expect(result).toBe(0);
    });

    it('should handle zero values', () => {
      expect(aggregateExpenses(0, 0, 0, true)).toBe(0);
      expect(aggregateExpenses(0, 0, 0, false)).toBe(0);
    });
  });

  describe('calculateTotalExpenses', () => {
    it('should sum all expense values', () => {
      const expenses = { housing: 1000, food: 500, transport: 300 };
      expect(calculateTotalExpenses(expenses)).toBe(1800);
    });

    it('should ignore negative values', () => {
      const expenses = { housing: 1000, food: -500, transport: 300 };
      expect(calculateTotalExpenses(expenses)).toBe(1300);
    });

    it('should handle empty object', () => {
      expect(calculateTotalExpenses({})).toBe(0);
    });

    it('should handle undefined', () => {
      expect(calculateTotalExpenses()).toBe(0);
    });
  });

  describe('calculateSharedExpenseContributions', () => {
    it('should split equally when incomes are equal', () => {
      const result = calculateSharedExpenseContributions(1000, 2000, 2000);
      expect(result.person1Contribution).toBe(500);
      expect(result.person2Contribution).toBe(500);
    });

    it('should split proportionally to income', () => {
      const result = calculateSharedExpenseContributions(1000, 3000, 1000);
      expect(result.person1Contribution).toBeCloseTo(750, 1);
      expect(result.person2Contribution).toBeCloseTo(250, 1);
    });

    it('should return zero contributions when both incomes are zero', () => {
      const result = calculateSharedExpenseContributions(1000, 0, 0);
      expect(result.person1Contribution).toBe(0);
      expect(result.person2Contribution).toBe(0);
    });

    it('should handle negative expenses (return 0)', () => {
      const result = calculateSharedExpenseContributions(-1000, 2000, 2000);
      expect(result.person1Contribution).toBe(0);
      expect(result.person2Contribution).toBe(0);
    });

    it('should handle negative incomes (treat as 0)', () => {
      const result = calculateSharedExpenseContributions(1000, -2000, 3000);
      expect(result.person1Contribution).toBe(0);
      expect(result.person2Contribution).toBe(1000);
    });

    it('should sum to total expenses', () => {
      const result = calculateSharedExpenseContributions(1000, 2000, 3000);
      const total = result.person1Contribution + result.person2Contribution;
      expect(Math.abs(total - 1000)).toBeLessThan(1); // Allow for rounding
    });
  });

  describe('mergeExpensesFromSeparateMode', () => {
    it('should merge expenses from both people and shared', () => {
      const p1 = { housing: 1000, food: 200 };
      const p2 = { housing: 1000, food: 300 };
      const shared = { housing: 500, utilities: 100 };
      
      const result = mergeExpensesFromSeparateMode(p1, p2, shared);
      expect(result.housing).toBe(2500);
      expect(result.food).toBe(500);
      expect(result.utilities).toBe(100);
    });

    it('should handle empty objects', () => {
      const result = mergeExpensesFromSeparateMode({}, {}, {});
      // Should have all EXPENSE_CATEGORIES initialized to 0
      expect(Object.values(result).every(v => v === 0)).toBe(true);
    });

    it('should handle undefined inputs', () => {
      const result = mergeExpensesFromSeparateMode();
      expect(result).toBeDefined();
      expect(Object.values(result).every(v => v === 0)).toBe(true);
    });
  });

  describe('parseDashboardData', () => {
    it('should parse shared mode dashboard data', () => {
      const result = parseDashboardData({
        calculationType: 'shared',
        incomes: [{ amount: '3000' }, { amount: '2000' }],
        savings: '1000',
        expenses: { housing: 1500, food: 500 },
      });

      expect(result.totalIncome).toBe(5000);
      expect(result.savingsAmount).toBe(1000);
      expect(result.totalExpenses).toBe(2000);
      expect(result.monthlyExpenses).toBe(2000);
      expect(result.includeSavingsInCalculations).toBe(true);
    });

    it('should parse separate mode dashboard data', () => {
      const result = parseDashboardData({
        calculationType: 'separate',
        person1Incomes: [{ amount: '3000' }],
        person2Incomes: [{ amount: '2000' }],
        person1Savings: '500',
        person2Savings: '300',
        person1Expenses: { housing: 800 },
        person2Expenses: { food: 400 },
        sharedExpenses: { housing: 700 },
      });

      expect(result.totalIncome).toBe(5000);
      expect(result.savingsAmount).toBe(800);
      expect(result.totalExpenses).toBe(1900);
    });

    it('should include savings pots monthly contributions in savings amount', () => {
      const result = parseDashboardData({
        calculationType: 'shared',
        incomes: [{ amount: '3000' }],
        savings: '500',
        expenses: { housing: 1000 },
        sharedSavingsPots: [
          { monthlyContribution: '200' },
          { monthlyContribution: '100' },
        ],
      });

      expect(result.savingsAmount).toBe(800);
    });

    it('should use per-person savings pots in separate mode', () => {
      const result = parseDashboardData({
        calculationType: 'separate',
        person1Incomes: [{ amount: '3000' }],
        person1Savings: '500',
        person1Expenses: {},
        person2Incomes: [],
        person2Savings: '100',
        person2Expenses: {},
        sharedExpenses: {},
        sharedSavingsPots: [{ monthlyContribution: '999' }],
        person1SavingsPots: [{ monthlyContribution: '100' }],
        person2SavingsPots: [{ monthlyContribution: '50' }],
      });

      expect(result.savingsAmount).toBe(750);
    });

    it('should return null for missing data', () => {
      expect(parseDashboardData(null)).toBeNull();
    });
  });

  describe('applyExpenseCategoryOverrides', () => {
    it('should apply overrides in shared mode', () => {
      const dashboardData = { calculationType: 'shared', expenses: { housing: 1000, food: 500 } };
      const result = applyExpenseCategoryOverrides(1500, { housing: '800' }, dashboardData);
      expect(result).toBe(1300);
    });
  });
});
