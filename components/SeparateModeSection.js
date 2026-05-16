/**
 * SeparateModeSection Component
 * Main content for separate (two-person) mode dashboard
 */

import { SHARED_EXPENSE_CATEGORIES, CATEGORY_ICONS } from '../lib/constants';
import PersonSection from './PersonSection';
import PieChartCard from './PieChartCard';

export default function SeparateModeSection({
  person1Name,
  setPerson1Name,
  person2Name,
  setPerson2Name,
  person1Incomes,
  setPerson1Incomes,
  person1Savings,
  setPerson1Savings,
  person1Expenses,
  setPerson1Expenses,
  person2Incomes,
  setPerson2Incomes,
  person2Savings,
  setPerson2Savings,
  person2Expenses,
  setPerson2Expenses,
  sharedExpenses,
  setSharedExpenses,
  getSymbol,
  t,
  isMobile,
  // Pre-calculated values from useSeparateDashboard
  person1Contribution,
  person2Contribution,
  person1Ratio,
  person2Ratio,
  person1PersonalExpenses,
  person2PersonalExpenses,
  person1SavingsNum,
  person2SavingsNum,
  sharedExpensesTotal,
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {/* Person 1 Section */}
        <div>
          <input
            type="text"
            value={person1Name}
            onChange={(e) => setPerson1Name(e.target.value)}
            className="w-full text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-brand-primary focus:outline-none px-0 py-2 transition-colors"
          />
          <PersonSection
            personLabel={person1Name}
            incomes={person1Incomes}
            setIncomes={setPerson1Incomes}
            savings={person1Savings}
            setSavings={setPerson1Savings}
            expenses={person1Expenses}
            setExpenses={setPerson1Expenses}
            getSymbol={getSymbol}
            t={t}
            isMobile={isMobile}
            isPersonOne={true}
            contribution={person1Contribution}
            showContribution={true}
          />
        </div>

        {/* Person 2 Section */}
        <div>
          <input
            type="text"
            value={person2Name}
            onChange={(e) => setPerson2Name(e.target.value)}
            className="w-full text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-brand-primary focus:outline-none px-0 py-2 transition-colors"
          />
          <PersonSection
            personLabel={person2Name}
            incomes={person2Incomes}
            setIncomes={setPerson2Incomes}
            savings={person2Savings}
            setSavings={setPerson2Savings}
            expenses={person2Expenses}
            setExpenses={setPerson2Expenses}
            getSymbol={getSymbol}
            t={t}
            isMobile={isMobile}
            isPersonOne={false}
            contribution={person2Contribution}
            showContribution={true}
          />
        </div>
      </div>

      {/* Shared Account Section */}
      <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('dashboard.sharedAccount')}</h2>

        {/* Shared Expenses */}
        <div className="card-expenses p-8 mb-6">
          <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.sharedExpensesBreakdown')}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHARED_EXPENSE_CATEGORIES.map((category) => {
              const IconComponent = CATEGORY_ICONS[category];
              return (
                <div key={category} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-100">
                    <IconComponent size={16} className="text-brand-primary" />
                    {t(`dashboard.expenseCategories.${category}`)}
                  </label>
                  <input
                    type="number"
                    value={sharedExpenses[category] || ''}
                    onChange={(e) => setSharedExpenses({ ...sharedExpenses, [category]: e.target.value })}
                    placeholder="0"
                    className="amount w-full"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Contributions Overview */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <div className="card p-3 sm:p-4 md:p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('dashboard.incomeRatio')}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-200 font-medium">{person1Name}:</span>
                <span className="font-mono text-lg font-bold text-brand-primary">{(person1Ratio * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-200 font-medium">{person2Name}:</span>
                <span className="font-mono text-lg font-bold text-brand-primary">{(person2Ratio * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-4 md:p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{person1Name}: {t('dashboard.contribution')}</p>
            <p className="font-mono text-2xl font-bold text-green-600 dark:text-green-400">{getSymbol()}{Math.floor(person1Contribution).toLocaleString('en-US')}</p>
          </div>

          <div className="card p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{person2Name}: {t('dashboard.contribution')}</p>
            <p className="font-mono text-2xl font-bold text-green-600 dark:text-green-400">{getSymbol()}{Math.floor(person2Contribution).toLocaleString('en-US')}</p>
          </div>
        </div>

        {/* Pie Charts */}
        <div className={`grid gap-6 mt-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {/* Person 1 Pie Chart */}
          <PieChartCard
            title={person1Name}
            data={[
              { name: t('dashboard.totalExpenses'), value: person1PersonalExpenses },
              { name: t('dashboard.contribution'), value: person1Contribution },
              { name: t('dashboard.savingsAmount'), value: person1SavingsNum },
              { name: t('dashboard.remaining'), value: Math.max(person1Incomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0) - person1PersonalExpenses - person1SavingsNum - person1Contribution, 0) }
            ]}
            getSymbol={getSymbol}
            isMobile={isMobile}
          />

          {/* Person 2 Pie Chart */}
          <PieChartCard
            title={person2Name}
            data={[
              { name: t('dashboard.totalExpenses'), value: person2PersonalExpenses },
              { name: t('dashboard.contribution'), value: person2Contribution },
              { name: t('dashboard.savingsAmount'), value: person2SavingsNum },
              { name: t('dashboard.remaining'), value: Math.max(person2Incomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0) - person2PersonalExpenses - person2SavingsNum - person2Contribution, 0) }
            ]}
            getSymbol={getSymbol}
            isMobile={isMobile}
          />

          {/* Shared Account Pie Chart */}
          <PieChartCard
            title={t('dashboard.sharedAccount')}
            data={Object.entries(sharedExpenses).map(([category, value]) => ({
              name: t(`dashboard.expenseCategories.${category}`),
              value: parseFloat(value) || 0
            })).filter(item => item.value > 0)}
            getSymbol={getSymbol}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}
