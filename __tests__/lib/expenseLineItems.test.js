import {
  calculateLineItemsTotal,
  migrateLegacyLineItems,
  syncExpenseCategoryFromLineItems,
} from '../../lib/expenseLineItems';

describe('expenseLineItems', () => {
  describe('calculateLineItemsTotal', () => {
    it('sums item amounts', () => {
      expect(calculateLineItemsTotal([
        { amount: '25' },
        { amount: '10.5' },
      ])).toBe(35.5);
    });
  });

  describe('syncExpenseCategoryFromLineItems', () => {
    it('writes combined total to expenses', () => {
      const result = syncExpenseCategoryFromLineItems(
        { Insurance: '999', Food: '100' },
        'Insurance',
        [{ amount: '40' }, { amount: '60' }]
      );
      expect(result.Insurance).toBe('100');
      expect(result.Food).toBe('100');
    });
  });

  describe('migrateLegacyLineItems', () => {
    it('creates a line item from legacy expense value', () => {
      const result = migrateLegacyLineItems(
        { Insurance: [] },
        { Insurance: '120' },
        ['Insurance']
      );
      expect(result.Insurance).toHaveLength(1);
      expect(result.Insurance[0].amount).toBe('120');
    });
  });
});
