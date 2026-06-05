/**
 * Reusable expense category input grid
 */

import { CATEGORY_ICONS } from '../lib/constants';

export default function ExpenseCategoryGrid({
  categories,
  expenses,
  onChange,
  t,
  gridClass = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
}) {
  return (
    <div className={gridClass}>
      {categories.map((category) => {
        const IconComponent = CATEGORY_ICONS[category];
        return (
          <div key={category} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              <IconComponent size={16} className="text-brand-primary" />
              {t(`dashboard.expenseCategories.${category}`)}
            </label>
            <input
              type="number"
              value={expenses[category] || ''}
              onChange={(e) => onChange(category, e.target.value)}
              placeholder="0"
              className="amount w-full"
            />
          </div>
        );
      })}
    </div>
  );
}
