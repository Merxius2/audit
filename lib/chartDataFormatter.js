/**
 * Chart Data Formatter Utilities
 * Provides functions to prepare and format data for chart rendering
 */

/**
 * Prepare pie chart data from expenses
 * Filters out zero values and adds remaining amount
 * @param {object} expenseData - Expense object {category: amount}
 * @param {number} remainingAmount - Amount left after expenses (can be negative)
 * @returns {array} Array of objects {name, value} suitable for pie chart
 */
export function preparePieChartData(expenseData = {}, remainingAmount = 0) {
  const data = Object.entries(expenseData)
    .map(([name, value]) => ({
      name,
      value: Math.max(0, parseFloat(value) || 0)
    }))
    .filter(item => item.value > 0);
  
  if (remainingAmount > 0) {
    data.push({ name: 'Remaining', value: remainingAmount });
  }
  
  return data;
}

/**
 * Calculate percentages for pie chart data
 * @param {array} pieData - Array of {name, value} objects
 * @returns {array} Same array with added percentage field
 */
export function addPercentagesToPieData(pieData = []) {
  const total = pieData.reduce((sum, item) => sum + item.value, 0);
  
  return pieData.map(item => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
  }));
}

/**
 * Format bar chart data for benchmark comparison
 * @param {array} items - Array of items with values
 * @param {function} valueExtractor - Function to extract numeric value
 * @returns {array} Formatted data for bar chart
 */
export function formatBarChartData(items = [], valueExtractor) {
  return items.map((item, index) => ({
    ...item,
    _index: index,
    value: Math.max(0, valueExtractor(item) || 0)
  }));
}

/**
 * Prepare time-series chart data (e.g., retirement projection over years)
 * @param {array} projectionData - Array of projection objects
 * @returns {array} Formatted for line/area chart
 */
export function prepareTimeSeriesData(projectionData = []) {
  return projectionData.map(item => ({
    ...item,
    balance: Math.max(0, item.balance || 0),
    contributions: Math.max(0, item.contributions || 0),
    gains: item.gains || 0
  }));
}
