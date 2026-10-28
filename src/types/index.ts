export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  monthlyBudget: number;
  joinedDate: string;
}

export type TransactionType = 'income' | 'expense';

export type CategoryId =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  budget: number;
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: CategoryId;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
}

export type PeriodFilter = 'daily' | 'weekly' | 'monthly';

export interface ReportSummary {
  income: number;
  expenses: number;
  netBalance: number;
  period: PeriodFilter;
  startDate: string;
  endDate: string;
  transactionCount: number;
  savingsRate: number; // percentage
}

export interface CategorySpending {
  category: Category;
  totalSpent: number;
  percentageOfExpenses: number;
  transactionCount: number;
  remainingBudget: number;
  budgetProgress: number; // 0 to 1+
  isOverBudget: boolean;
}

export interface InAppAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  timestamp: string;
}

// Navigation Parameter Types
export type RootStackParamList = {
  Launch: undefined;
  SignIn: undefined;
  SignUp: undefined;
  MainDrawer: undefined;
  EditProfile: undefined;
  CategoryDetails: { categoryId: CategoryId };
  AddTransaction: { editTransactionId?: string; prefillCategoryId?: CategoryId };
};

export type DrawerParamList = {
  TabNavigator: undefined;
  Home: undefined;
  Analysis: undefined;
  Transactions: undefined;
  Categories: undefined;
  Profile: undefined;
};

export type CustomerTabParamList = {
  HomeTab: undefined;
  AnalysisTab: undefined;
  TransactionsTab: undefined;
  CategoriesTab: undefined;
  ProfileTab: undefined;
};

export type AdminTabParamList = {
  HomeTab: undefined;
  AnalysisTab: undefined;
};
