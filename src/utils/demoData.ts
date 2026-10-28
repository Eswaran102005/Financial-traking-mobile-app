import { User, Transaction } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';

export const DEMO_ADMIN: User = {
  id: 'user_admin_01',
  name: 'System Administrator',
  email: 'admin@budget.com',
  phone: '+91 99000 11223',
  role: 'admin',
  monthlyBudget: 150000,
  joinedDate: '2024-01-10',
};

export const DEMO_CUSTOMER: User = {
  id: 'user_alex_01',
  name: 'Alex Morgan',
  email: 'alex@budget.com',
  phone: '+91 98765 43210',
  role: 'customer',
  monthlyBudget: 45000,
  joinedDate: '2024-03-15',
};

export const DEMO_CREDENTIALS = [
  {
    email: 'admin@budget.com',
    password: 'admin123',
    user: DEMO_ADMIN,
  },
  {
    email: 'alex@budget.com',
    password: 'customer123',
    user: DEMO_CUSTOMER,
  },
];

// Helper to format date offset from today
const getOffsetDateString = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const generateSampleTransactions = (customerId: string = DEMO_CUSTOMER.id): Transaction[] => {
  return [
    // Today's Transactions
    {
      id: 'tx_01',
      userId: customerId,
      title: 'Consulting Project Milestone',
      amount: 25000,
      type: 'income',
      categoryId: 'other',
      date: getOffsetDateString(0),
      note: 'Freelance UI/UX design payment received',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_02',
      userId: customerId,
      title: 'Gourmet Lunch at Bistro',
      amount: 650,
      type: 'expense',
      categoryId: 'food',
      date: getOffsetDateString(0),
      note: 'Lunch with colleagues',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_03',
      userId: customerId,
      title: 'Espresso & Bakery',
      amount: 220,
      type: 'expense',
      categoryId: 'food',
      date: getOffsetDateString(0),
      note: 'Morning coffee',
      createdAt: new Date().toISOString(),
    },

    // This Week's Transactions (1 - 5 days ago)
    {
      id: 'tx_04',
      userId: customerId,
      title: 'Metro SmartCard Top-up',
      amount: 500,
      type: 'expense',
      categoryId: 'transport',
      date: getOffsetDateString(-1),
      note: 'Weekly rapid transit recharge',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_05',
      userId: customerId,
      title: 'Weekly Fresh Groceries',
      amount: 1850,
      type: 'expense',
      categoryId: 'food',
      date: getOffsetDateString(-2),
      note: 'Supermarket vegetables and dairy',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_06',
      userId: customerId,
      title: 'Movie Night & Popcorn',
      amount: 780,
      type: 'expense',
      categoryId: 'entertainment',
      date: getOffsetDateString(-3),
      note: 'Weekend cinema IMAX tickets',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_07',
      userId: customerId,
      title: 'Broadband Fiber & Electricity',
      amount: 2400,
      type: 'expense',
      categoryId: 'bills',
      date: getOffsetDateString(-4),
      note: 'Utility bill payments',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_08',
      userId: customerId,
      title: 'Pharmacy & Wellness Vitamins',
      amount: 1250,
      type: 'expense',
      categoryId: 'healthcare',
      date: getOffsetDateString(-5),
      note: 'Prescription refill',
      createdAt: new Date().toISOString(),
    },

    // Earlier this month
    {
      id: 'tx_09',
      userId: customerId,
      title: 'Full-time Tech Salary',
      amount: 72000,
      type: 'income',
      categoryId: 'other',
      date: getOffsetDateString(-10),
      note: 'Direct deposit monthly payroll',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_10',
      userId: customerId,
      title: 'Sneakers & Casual Wear',
      amount: 3400,
      type: 'expense',
      categoryId: 'shopping',
      date: getOffsetDateString(-12),
      note: 'Online shopping festive sale',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_11',
      userId: customerId,
      title: 'React Native Masterclass',
      amount: 1999,
      type: 'expense',
      categoryId: 'education',
      date: getOffsetDateString(-15),
      note: 'Mobile app certification course',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_12',
      userId: customerId,
      title: 'Weekend Getaway Hotel',
      amount: 4200,
      type: 'expense',
      categoryId: 'travel',
      date: getOffsetDateString(-18),
      note: 'Resort booking with friends',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_13',
      userId: customerId,
      title: 'Ride Hailing Cab',
      amount: 420,
      type: 'expense',
      categoryId: 'transport',
      date: getOffsetDateString(-20),
      note: 'Airport drop ride',
      createdAt: new Date().toISOString(),
    },

    // Last Month Transactions
    {
      id: 'tx_14',
      userId: customerId,
      title: 'Previous Month Salary',
      amount: 72000,
      type: 'income',
      categoryId: 'other',
      date: getOffsetDateString(-35),
      note: 'Last month payroll',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_15',
      userId: customerId,
      title: 'Quarterly Laptop Maintenance',
      amount: 2800,
      type: 'expense',
      categoryId: 'other',
      date: getOffsetDateString(-38),
      note: 'Hardware cleaning and service',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx_16',
      userId: customerId,
      title: 'Dining Out with Family',
      amount: 2450,
      type: 'expense',
      categoryId: 'food',
      date: getOffsetDateString(-40),
      note: 'Birthday dinner celebration',
      createdAt: new Date().toISOString(),
    },
  ];
};
