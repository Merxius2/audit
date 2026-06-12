import {
  calculateSavingsPotsMonthlyTotal,
  calculateSeparateModePotsMonthlyTotal,
  getSavingsPotsForMode,
  getSavingsPotsForScope,
  getSavingsPotsStorageKey,
} from '../../lib/savingsPots';

describe('savingsPots', () => {
  describe('calculateSavingsPotsMonthlyTotal', () => {
    it('sums monthly contributions', () => {
      expect(calculateSavingsPotsMonthlyTotal([
        { monthlyContribution: '150' },
        { monthlyContribution: '50' },
      ])).toBe(200);
    });

    it('returns 0 for empty or missing pots', () => {
      expect(calculateSavingsPotsMonthlyTotal([])).toBe(0);
      expect(calculateSavingsPotsMonthlyTotal()).toBe(0);
    });
  });

  describe('calculateSeparateModePotsMonthlyTotal', () => {
    it('sums both persons pots', () => {
      expect(calculateSeparateModePotsMonthlyTotal({
        person1SavingsPots: [{ monthlyContribution: '100' }],
        person2SavingsPots: [{ monthlyContribution: '50' }],
      })).toBe(150);
    });
  });

  describe('getSavingsPotsForScope', () => {
    it('reads scope-specific pots', () => {
      const data = {
        sharedSavingsPots: [{ id: '1' }],
        person1SavingsPots: [{ id: '2' }],
        person2SavingsPots: [{ id: '3' }, { id: '4' }],
      };

      expect(getSavingsPotsForScope(data, 'shared')).toHaveLength(1);
      expect(getSavingsPotsForScope(data, 'person1')).toHaveLength(1);
      expect(getSavingsPotsForScope(data, 'person2')).toHaveLength(2);
    });

    it('falls back to legacy shared pots', () => {
      expect(getSavingsPotsForScope({ savingsPots: [{ id: 'legacy' }] }, 'shared')).toHaveLength(1);
      expect(getSavingsPotsForScope({ savingsPots: [{ id: 'legacy' }] }, 'person1')).toHaveLength(0);
    });
  });

  describe('getSavingsPotsForMode', () => {
    it('combines person pots in separate mode', () => {
      const data = {
        calculationType: 'separate',
        person1SavingsPots: [{ id: '1' }],
        person2SavingsPots: [{ id: '2' }],
      };
      expect(getSavingsPotsForMode(data)).toHaveLength(2);
    });
  });

  describe('getSavingsPotsStorageKey', () => {
    it('maps scopes to storage keys', () => {
      expect(getSavingsPotsStorageKey('shared')).toBe('sharedSavingsPots');
      expect(getSavingsPotsStorageKey('person1')).toBe('person1SavingsPots');
      expect(getSavingsPotsStorageKey('person2')).toBe('person2SavingsPots');
    });
  });
});
