/**
 * Tax Calculator Tests
 * Tests for calculateTaxBreakdown and related tax calculation functions
 */

describe('Tax Calculator', () => {
  // Import the function to test
  const { calculateTaxBreakdown } = require('../lib/taxCalculator');

  // Mock tax brackets for testing (simplified Dutch tax system)
  const mockTaxBrackets = [
    { min: 0, max: 22414, rate: 0.37, label: 'Bracket 1' },
    { min: 22414, max: 73031, rate: 0.49, label: 'Bracket 2' },
    { min: 73031, max: Infinity, rate: 0.49, label: 'Bracket 3' },
  ];

  const mockGeneralTaxCreditBrackets = {
    bracket1: { max: 21543, credit: 3235 },
    bracket2: { start: 21543, end: 63941, baseCredit: 3235, phaseOutRate: 0.06955 },
  };

  const mockEarnedIncomeCreditBrackets = [
    { max: 10000, rate: 0.06955 },
    { min: 10000, max: 21543, base: 695.50, rate: 0.06955 },
    { min: 21543, max: 37679, base: 1410, rate: 0.01968 },
    { credit: 0 },
  ];

  describe('calculateTaxBreakdown', () => {
    it('should return zero tax for negative income', () => {
      const result = calculateTaxBreakdown(-10000, mockTaxBrackets, mockGeneralTaxCreditBrackets, mockEarnedIncomeCreditBrackets);
      expect(result.grossIncome).toBe(0);
      expect(result.incomeTax).toBe(0);
      expect(result.netIncome).toBe(0);
    });

    it('should return zero tax for zero income', () => {
      const result = calculateTaxBreakdown(0, mockTaxBrackets, mockGeneralTaxCreditBrackets, mockEarnedIncomeCreditBrackets);
      expect(result.grossIncome).toBe(0);
      expect(result.incomeTax).toBe(0);
      expect(result.netIncome).toBe(0);
    });

    it('should calculate tax for income in first bracket', () => {
      const result = calculateTaxBreakdown(20000, mockTaxBrackets, mockGeneralTaxCreditBrackets, mockEarnedIncomeCreditBrackets);
      expect(result.grossIncome).toBe(20000);
      expect(result.incomeTax).toBeGreaterThan(0);
      expect(result.netIncome).toBeLessThan(20000);
      expect(result.effectiveRate).toBeGreaterThan(0);
      expect(result.effectiveRate).toBeLessThan(50);
    });

    it('should calculate tax for income spanning multiple brackets', () => {
      const result = calculateTaxBreakdown(50000, mockTaxBrackets, mockGeneralTaxCreditBrackets, mockEarnedIncomeCreditBrackets);
      expect(result.grossIncome).toBe(50000);
      expect(result.bracketsBreakdown.length).toBeGreaterThan(1);
      expect(result.incomeTax).toBeGreaterThan(0);
      expect(result.netIncome).toBeLessThan(50000);
    });

    it('should handle invalid tax brackets gracefully', () => {
      const result = calculateTaxBreakdown(30000, [], mockGeneralTaxCreditBrackets, mockEarnedIncomeCreditBrackets);
      expect(result.grossIncome).toBe(30000);
      expect(result.bracketsBreakdown).toEqual([]);
    });

    it('should return gross income equals net plus tax', () => {
      const result = calculateTaxBreakdown(75000, mockTaxBrackets, mockGeneralTaxCreditBrackets, mockEarnedIncomeCreditBrackets);
      const calculated = result.netIncome + result.totalTax;
      expect(Math.abs(calculated - result.grossIncome)).toBeLessThan(1); // Allow for rounding
    });

    it('should never return negative values', () => {
      const result = calculateTaxBreakdown(100000, mockTaxBrackets, mockGeneralTaxCreditBrackets, mockEarnedIncomeCreditBrackets);
      expect(result.incomeTax).toBeGreaterThanOrEqual(0);
      expect(result.netIncome).toBeGreaterThanOrEqual(0);
      expect(result.effectiveRate).toBeGreaterThanOrEqual(0);
      expect(result.totalCredits).toBeGreaterThanOrEqual(0);
    });
  });
});
