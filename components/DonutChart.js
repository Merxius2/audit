/**
 * Reusable Donut Chart Component
 * Features:
 * - Donut chart with center content display
 * - Total label and amount in the center circle
 * - Vibrant segment colors with white strokes
 * - Legend below the chart
 * - Mobile responsive
 */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../lib/constants';
import { useDarkMode } from '../context/DarkModeContext';

export default function DonutChart({ 
  data, 
  totalAmount, 
  getSymbol, 
  isMobile,
  title = 'TOTAL',
  height = 300,
  innerRadius = '70%',
  outerRadius = '90%'
}) {
  const { isDarkMode } = useDarkMode();
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const filteredData = data.filter(item => item.value > 0);

  // Center circle styling based on theme
  const centerCircleStyle = {
    width: `${height * 0.6}px`,
    height: `${height * 0.6}px`,
    boxShadow: isDarkMode 
      ? '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 10px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    background: isDarkMode
      ? 'linear-gradient(to bottom, #1f2937, #111827)'
      : 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)'
  };

  const titleTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const amountTextColor = isDarkMode ? 'text-white' : 'text-gray-900';

  // Custom label renderer for center content
  const renderCustomLabel = () => null; // We'll use custom content instead

  return (
    <div className="w-full">
      <div className="relative w-full flex justify-center">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              label={false}
            >
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${getSymbol()}${Math.floor(value).toLocaleString('en-US')}`}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
                border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                color: isDarkMode ? '#F3F4F6' : '#1F2937'
              }}
              labelStyle={{ color: isDarkMode ? '#F3F4F6' : '#1F2937' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center content circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="flex flex-col items-center justify-center rounded-full shadow-lg"
            style={centerCircleStyle}
          >
            <p className={`text-sm font-semibold uppercase tracking-widest ${titleTextColor}`}>
              {title}
            </p>
            <p className={`text-xl sm:text-2xl font-bold mt-2 font-mono ${amountTextColor}`}>
              {getSymbol()}{Math.floor(totalAmount).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={`mt-6 ${isMobile ? 'space-y-2' : 'grid grid-cols-1 gap-3'}`}>
        {filteredData.map((entry, index) => {
          const percentage = totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : 0;
          return (
            <div 
              key={`legend-${index}`} 
              className="flex items-center gap-3 text-sm"
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0 border border-gray-300 dark:border-gray-600" 
                style={{
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                }} 
              />
              <span className="text-gray-700 dark:text-gray-300 flex-1">
                <span className="font-medium">{entry.name}:</span>
                <span className="ml-2 font-mono">{getSymbol()}{Math.floor(entry.value).toLocaleString('en-US')}</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">({percentage}%)</span>
              </span>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="h-32 flex items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No data to display</p>
        </div>
      )}
    </div>
  );
}
