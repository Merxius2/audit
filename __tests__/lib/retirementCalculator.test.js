/**
 * Retirement Calculator Tests
 * Tests for generateForwardProjection, generateBackwardProjection, and calculateMonthlyInvestmentBackward
 */

describe('Retirement Calculator', () => {
  // Import the functions to test
  const { generateForwardProjection, generateBackwardProjection, calculateMonthlyInvestmentBackward } = require('../lib/retirementCalculator');

  describe('generateForwardProjection', () => {
    it('should return empty array for invalid ages', () => {
      const result = generateForwardProjection(65, 60, 1000, 7); // retirement < current
      expect(result).toEqual([]);
    });

    it('should return empty array for negative current age', () => {
      const result = generateForwardProjection(-5, 65, 1000, 7);
      expect(result).toEqual([]);
    });

    it('should calculate forward projection correctly', () => {
      const result = generateForwardProjection(25, 30, 1000, 7);
      expect(result.length).toBe(6); // 25, 26, 27, 28, 29, 30
      expect(result[0].age).toBe(25);
      expect(result[0].balance).toBeGreaterThanOrEqual(0);
      expect(result[result.length - 1].age).toBe(30);
    });

    it('should handle zero monthly investment', () => {
      const result = generateForwardProjection(25, 30, 0, 7);
      expect(result.length).toBe(6);
      expect(result[0].balance).toBe(0);
    });

    it('should handle 0% return rate', () => {
      const result = generateForwardProjection(25, 30, 1000, 0);
      expect(result.length).toBe(6);
      // With 0% return, balance should equal contributions
      expect(result[1].contributions).toBe(12000); // 12 months * 1000
    });
  });

  describe('generateBackwardProjection', () => {
    it('should return empty array for invalid ages', () => {
      const result = generateBackwardProjection(65, 60, 500000, 7);
      expect(result).toEqual([]);
    });

    it('should return empty array for negative goal', () => {
      const result = generateBackwardProjection(25, 65, -500000, 7);
      expect(result).toEqual([]);
    });

    it('should calculate backward projection correctly', () => {
      const result = generateBackwardProjection(25, 30, 100000, 7);
      expect(result.length).toBe(6);
      expect(result[0].age).toBe(25);
      expect(result[result.length - 1].age).toBe(30);
      expect(result[result.length - 1].balance).toBeCloseTo(100000, -3);
    });

    it('should handle zero goal balance', () => {
      const result = generateBackwardProjection(25, 30, 0, 7);
      expect(result.length).toBe(6);
      expect(result[0].balance).toBe(0);
    });
  });

  describe('calculateMonthlyInvestmentBackward', () => {
    it('should return 0 for invalid inputs', () => {
      expect(calculateMonthlyInvestmentBackward(500000, 65, 60, 7)).toBe(0); // retirement < current
      expect(calculateMonthlyInvestmentBackward(500000, -5, 65, 7)).toBe(0); // negative current age
      expect(calculateMonthlyInvestmentBackward(-100000, 25, 65, 7)).toBe(0); // negative goal
    });

    it('should calculate monthly investment for goal', () => {
      const result = calculateMonthlyInvestmentBackward(500000, 25, 65, 7);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(500000); // Monthly should be less than total goal
    });

    it('should handle 0% return rate', () => {
      const result = calculateMonthlyInvestmentBackward(480000, 25, 65, 0);
      expect(result).toBeCloseTo(1000, 0); // 480000 / 480 months = 1000
    });

    it('should return 0 for same current and retirement age', () => {
      const result = calculateMonthlyInvestmentBackward(500000, 65, 65, 7);
      expect(result).toBe(0);
    });
  });
});
