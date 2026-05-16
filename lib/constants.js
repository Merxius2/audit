/**
 * Shared constants across pages
 */

import { Home, Car, UtensilsCrossed, Zap, Heart, Smile, CreditCard, Phone, Shield, MoreHorizontal, Receipt, Tv } from 'lucide-react';

export const EXPENSE_CATEGORIES = [
  'House',
  'Car',
  'Food',
  'Utilities',
  'Healthcare',
  'Leisure',
  'Subscriptions',
  'Phone',
  'Insurance',
  'Other',
];

export const SHARED_EXPENSE_CATEGORIES = [
  'House',
  'Food',
  'Utilities',
  'Insurance',
  'Other',
  'Subscriptions',
  'Taxes',
  'InternetTV',
  'Car',
];

export const PERSONAL_EXPENSE_CATEGORIES = [
  'Car',
  'Healthcare',
  'Leisure',
  'Other',
  'Phone',
  'Subscriptions',
];

export const CHART_COLORS = [
  '#EC4899', // pink
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#06B6D4', // cyan
  '#14B8A6', // teal
  '#EF4444', // red
  '#8B5CF6', // violet
  '#F97316', // orange
];

export const CATEGORY_ICONS = {
  'House': Home,
  'Car': Car,
  'Food': UtensilsCrossed,
  'Utilities': Zap,
  'Healthcare': Heart,
  'Leisure': Smile,
  'Subscriptions': CreditCard,
  'Phone': Phone,
  'Insurance': Shield,
  'Other': MoreHorizontal,
  'Taxes': Receipt,
  'InternetTV': Tv,
};

export const BENCHMARK_MEDIANS = {
  // Age groups (years) with education-based breakdowns
  byAgeAndEducation: {
    '20-30': {
      highSchool: { income: 25000, netWorth: 15000 },
      bachelor: { income: 35000, netWorth: 35000 },
      master: { income: 42000, netWorth: 55000 },
    },
    '30-40': {
      highSchool: { income: 32000, netWorth: 75000 },
      bachelor: { income: 48000, netWorth: 140000 },
      master: { income: 58000, netWorth: 200000 },
    },
    '40-50': {
      highSchool: { income: 38000, netWorth: 150000 },
      bachelor: { income: 58000, netWorth: 280000 },
      master: { income: 72000, netWorth: 420000 },
    },
    '50-60': {
      highSchool: { income: 40000, netWorth: 240000 },
      bachelor: { income: 62000, netWorth: 480000 },
      master: { income: 78000, netWorth: 700000 },
    },
    '60+': {
      highSchool: { income: 28000, netWorth: 280000 },
      bachelor: { income: 45000, netWorth: 580000 },
      master: { income: 58000, netWorth: 850000 },
    },
  },
  // Fallback for backward compatibility
  nl: {
    income: 35000,
    netWorth: 100000,
  },
  international: {
    income: 45000,
    netWorth: 120000,
  },
};
