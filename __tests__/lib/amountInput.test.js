import { sanitizeNonNegativeInput, parseNonNegativeAmount } from '../../lib/amountInput';

describe('amountInput', () => {
  describe('sanitizeNonNegativeInput', () => {
    it('allows empty string', () => {
      expect(sanitizeNonNegativeInput('')).toBe('');
    });

    it('strips minus signs', () => {
      expect(sanitizeNonNegativeInput('-100')).toBe('100');
      expect(sanitizeNonNegativeInput('-')).toBe('');
    });

    it('allows positive values and partial decimals', () => {
      expect(sanitizeNonNegativeInput('250')).toBe('250');
      expect(sanitizeNonNegativeInput('12.')).toBe('12.');
    });
  });

  describe('parseNonNegativeAmount', () => {
    it('returns 0 for empty or negative values', () => {
      expect(parseNonNegativeAmount('')).toBe(0);
      expect(parseNonNegativeAmount('-50')).toBe(0);
    });

    it('parses positive numbers', () => {
      expect(parseNonNegativeAmount('500')).toBe(500);
    });
  });
});
