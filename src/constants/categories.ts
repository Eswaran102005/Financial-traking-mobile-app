import { Category } from '../types';
import { PALETTE } from './theme';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    iconName: 'Utensils',
    color: '#D97706', // Warm amber slate accent
    bgColor: '#FEF3C7',
    budget: 8000,
  },
  {
    id: 'transport',
    name: 'Transportation',
    iconName: 'Car',
    color: PALETTE.darkNavy, // #24303E Dark Navy
    bgColor: '#E2E8F0',
    budget: 4000,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    iconName: 'ShoppingBag',
    color: PALETTE.slateBlue, // #64748B Slate Blue
    bgColor: '#F1F5F9',
    budget: 6000,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    iconName: 'Film',
    color: '#475569', // Slate
    bgColor: '#E2E8F0',
    budget: 3500,
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    iconName: 'Receipt',
    color: PALETTE.deepBlack, // #0B0F14 Deep Black
    bgColor: '#CBD5E1',
    budget: 7000,
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    iconName: 'HeartPulse',
    color: '#059669', // Subtle green
    bgColor: '#ECFDF5',
    budget: 5000,
  },
  {
    id: 'education',
    name: 'Education',
    iconName: 'GraduationCap',
    color: PALETTE.darkNavy, // #24303E Dark Navy
    bgColor: '#E2E8F0',
    budget: 4500,
  },
  {
    id: 'travel',
    name: 'Travel & Trips',
    iconName: 'Plane',
    color: PALETTE.slateBlue, // #64748B Slate Blue
    bgColor: '#F1F5F9',
    budget: 5000,
  },
  {
    id: 'other',
    name: 'General & Other',
    iconName: 'CircleEllipsis',
    color: PALETTE.slateBlue, // #64748B Slate Blue
    bgColor: '#F8FAFC',
    budget: 2500,
  },
];

export const getCategoryById = (id: string, customCategories?: Category[]): Category => {
  const list = customCategories || DEFAULT_CATEGORIES;
  const found = list.find((c) => c.id === id);
  if (found) return found;
  return {
    id: 'other',
    name: 'General & Other',
    iconName: 'CircleEllipsis',
    color: PALETTE.slateBlue,
    bgColor: '#F8FAFC',
    budget: 2500,
  };
};
