import { TrendingUp, Minus, TrendingDown } from 'lucide-react';

export default function MedianBadge({ value, median }) {
  let status, Icon, label, className;

  if (value > median) {
    status = 'above';
    Icon = TrendingUp;
    label = 'Above Median';
    className = 'badge-above';
  } else if (value === median) {
    status = 'at';
    Icon = Minus;
    label = 'At Median';
    className = 'badge-at';
  } else {
    status = 'below';
    Icon = TrendingDown;
    label = 'Below Median';
    className = 'badge-below';
  }

  return (
    <div className={`${className} inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold`}>
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
}
