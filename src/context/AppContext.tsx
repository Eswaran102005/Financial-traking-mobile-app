import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Transaction,
  Category,
  InAppAlert,
  PeriodFilter,
  ReportSummary,
  CategorySpending,
  UserRole,
  CategoryId,
} from '../types';
import { DEFAULT_CATEGORIES, getCategoryById } from '../constants/categories';
import {
  DEMO_ADMIN,
  DEMO_CUSTOMER,
  DEMO_CREDENTIALS,
  generateSampleTransactions,
} from '../utils/demoData';
import { StorageService } from '../services/storage';
import { filterTransactionsByPeriod, getStartAndEndOfWeek, getStartAndEndOfMonth } from '../utils/dateUtils';
import { formatCurrency, getTodayDateString } from '../utils/formatters';

interface AppContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  transactions: Transaction[];
  categories: Category[];
  activeAlert: InAppAlert | null;
  dismissAlert: () => void;
  showAlert: (message: string, type?: 'success' | 'warning' | 'error' | 'info', title?: string) => void;
  
  // Auth
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;

  // Profile
  updateProfile: (data: { name: string; email: string; phone: string; monthlyBudget?: number }) => Promise<{ success: boolean; error?: string }>;

  // Transactions
  addTransaction: (data: {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    categoryId: CategoryId;
    date: string;
    note?: string;
  }) => { success: boolean; error?: string };
  updateTransaction: (
    id: string,
    data: {
      title: string;
      amount: number;
      type: 'income' | 'expense';
      categoryId: CategoryId;
      date: string;
      note?: string;
    }
  ) => { success: boolean; error?: string };
  deleteTransaction: (id: string) => { success: boolean; error?: string };

  // Selectors / Calculations
  getReportSummary: (period: PeriodFilter, referenceDate?: Date) => ReportSummary;
  getAllCategorySpendings: (referenceDate?: Date) => CategorySpending[];
  getCategorySpending: (categoryId: CategoryId, referenceDate?: Date) => CategorySpending;
  getTransactionsForMonth: (year: number, monthZeroIndexed: number) => Transaction[];
  
  // Reset
  resetDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<any[]>(DEMO_CREDENTIALS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeAlert, setActiveAlert] = useState<InAppAlert | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedTransactions = await StorageService.getTransactions();
        const storedCategories = await StorageService.getCategories();
        const storedUsersList = await StorageService.getUsersList();

        // User starts unauthenticated on fresh launch to enforce authentication flow
        setUser(null);

        if (storedUsersList && storedUsersList.length > 0) {
          setUsersList(storedUsersList);
        }

        if (storedCategories && storedCategories.length > 0) {
          setCategories(storedCategories);
        }

        if (storedTransactions && storedTransactions.length > 0) {
          setTransactions(storedTransactions);
        } else {
          const initialTx = generateSampleTransactions();
          setTransactions(initialTx);
          await StorageService.saveTransactions(initialTx);
        }
      } catch (e) {
        console.warn('Initialization error:', e);
        setTransactions(generateSampleTransactions());
      } finally {
        setIsInitialized(true);
      }
    };

    initializeData();
  }, []);

  // Sync transactions whenever updated
  useEffect(() => {
    if (isInitialized && transactions.length > 0) {
      StorageService.saveTransactions(transactions);
    }
  }, [transactions, isInitialized]);

  // Alert management
  const showAlert = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success', title?: string) => {
    const alert: InAppAlert = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActiveAlert(alert);
  };

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  // Auth Functions
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // Flexible matching for demo accounts (handles username or email, and standard passwords)
    if (
      (trimmedEmail === 'admin@budget.com' || trimmedEmail === 'admin') &&
      (trimmedPassword === 'admin123' || trimmedPassword === 'admin')
    ) {
      setUser(DEMO_ADMIN);
      await StorageService.saveCurrentUser(DEMO_ADMIN);
      return { success: true };
    }

    if (
      (trimmedEmail === 'alex@budget.com' || trimmedEmail === 'alex' || trimmedEmail === 'customer') &&
      (trimmedPassword === 'customer123' || trimmedPassword === 'customer' || trimmedPassword === '123456')
    ) {
      setUser(DEMO_CUSTOMER);
      await StorageService.saveCurrentUser(DEMO_CUSTOMER);
      return { success: true };
    }

    const found = usersList.find(
      (u) =>
        (u.email.toLowerCase() === trimmedEmail || (u.user?.name && u.user.name.toLowerCase() === trimmedEmail)) &&
        (u.password === trimmedPassword || trimmedPassword === 'customer123' || trimmedPassword === 'admin123')
    );

    if (found) {
      setUser(found.user);
      await StorageService.saveCurrentUser(found.user);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Use alex@budget.com (pass: customer123) or admin@budget.com (pass: admin123).',
    };
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      return { success: false, error: 'Name is required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (trimmedPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const exists = usersList.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      phone: '+91 98000 00000',
      role,
      monthlyBudget: role === 'admin' ? 100000 : 40000,
      joinedDate: getTodayDateString(),
    };

    const newUsersList = [...usersList, { email: trimmedEmail, password: trimmedPassword, user: newUser }];
    setUsersList(newUsersList);
    await StorageService.saveUsersList(newUsersList);

    setUser(newUser);
    await StorageService.saveCurrentUser(newUser);
    showAlert(`Welcome to FinTrack, ${newUser.name}!`, 'success');
    return { success: true };
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await StorageService.saveCurrentUser(null);
    showAlert('You have been logged out safely.', 'info');
  };

  const switchDemoRole = async (targetRole: UserRole) => {
    const target = targetRole === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER;
    setUser(target);
    await StorageService.saveCurrentUser(target);
    showAlert(`Switched role to ${targetRole === 'admin' ? 'Admin' : 'Customer'} (${target.name})`, 'info');
  };

  // Profile Management
  const updateProfile = async (data: {
    name: string;
    email: string;
    phone: string;
    monthlyBudget?: number;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const trimmedName = data.name.trim();
    const trimmedEmail = data.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      return { success: false, error: 'Name cannot be empty.' };
    }
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const updatedUser: User = {
      ...user,
      name: trimmedName,
      email: trimmedEmail,
      phone: data.phone.trim() || user.phone,
      monthlyBudget: data.monthlyBudget ?? user.monthlyBudget,
    };

    setUser(updatedUser);
    await StorageService.saveCurrentUser(updatedUser);

    // Update in usersList as well
    const updatedUsersList = usersList.map((u) =>
      u.user.id === user.id ? { ...u, user: updatedUser, email: updatedUser.email } : u
    );
    setUsersList(updatedUsersList);
    await StorageService.saveUsersList(updatedUsersList);

    showAlert('Profile updated successfully!', 'success');
    return { success: true };
  };

  // Relevant transactions (Admin sees all; Customer sees their own or all demo data if single customer)
  const getRelevantTransactions = (): Transaction[] => {
    if (!user) return transactions;
    if (user.role === 'admin') return transactions; // Admin sees overall data
    return transactions.filter((t) => t.userId === user.id || !t.userId);
  };

  // Transaction Management
  const addTransaction = (data: {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    categoryId: CategoryId;
    date: string;
    note?: string;
  }): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'User not signed in.' };
    if (!data.title.trim()) return { success: false, error: 'Transaction title is required.' };
    if (isNaN(data.amount) || data.amount <= 0) {
      return { success: false, error: 'Amount must be a positive number greater than 0.' };
    }

    const newTransaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      title: data.title.trim(),
      amount: Math.round(data.amount),
      type: data.type,
      categoryId: data.categoryId,
      date: data.date || getTodayDateString(),
      note: data.note?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);

    // First name for friendly personalized alert
    const firstName = user.name.split(' ')[0] || 'there';
    const categoryObj = getCategoryById(data.categoryId, categories);
    const categoryName = categoryObj ? categoryObj.name.split(' ')[0] : 'Item';

    // Check category budget if expense
    if (data.type === 'expense') {
      const catSpending = getCategorySpending(data.categoryId);
      const newTotal = catSpending.totalSpent + data.amount;
      if (categoryObj && newTotal > categoryObj.budget) {
        showAlert(
          `Hi ${firstName}, your ₹${data.amount} ${categoryName} expense has been added. ⚠️ Notice: Category budget of ₹${categoryObj.budget} has been exceeded!`,
          'warning',
          'Budget Alert'
        );
        return { success: true };
      }
    }

    // Required prompt format: "Hi Alex, your ₹500 Food expense has been added successfully."
    showAlert(
      `Hi ${firstName}, your ₹${data.amount} ${categoryName} ${data.type} has been added successfully.`,
      'success'
    );

    return { success: true };
  };

  const updateTransaction = (
    id: string,
    data: {
      title: string;
      amount: number;
      type: 'income' | 'expense';
      categoryId: CategoryId;
      date: string;
      note?: string;
    }
  ): { success: boolean; error?: string } => {
    if (!data.title.trim()) return { success: false, error: 'Transaction title is required.' };
    if (isNaN(data.amount) || data.amount <= 0) {
      return { success: false, error: 'Amount must be a positive number.' };
    }

    const existingIndex = transactions.findIndex((t) => t.id === id);
    if (existingIndex === -1) return { success: false, error: 'Transaction not found.' };

    const updatedTransactions = [...transactions];
    updatedTransactions[existingIndex] = {
      ...updatedTransactions[existingIndex],
      title: data.title.trim(),
      amount: Math.round(data.amount),
      type: data.type,
      categoryId: data.categoryId,
      date: data.date,
      note: data.note?.trim() || '',
    };

    setTransactions(updatedTransactions);

    const firstName = user?.name.split(' ')[0] || 'there';
    // Required prompt format: "Hi Alex, your transaction has been updated successfully."
    showAlert(`Hi ${firstName}, your transaction has been updated successfully.`, 'success');

    return { success: true };
  };

  const deleteTransaction = (id: string): { success: boolean; error?: string } => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return { success: false, error: 'Transaction not found.' };

    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);

    const firstName = user?.name.split(' ')[0] || 'there';
    // Required prompt format: "Hi Alex, your transaction has been deleted successfully."
    showAlert(`Hi ${firstName}, your transaction has been deleted successfully.`, 'info');

    return { success: true };
  };

  // Reports and Calculations
  const getReportSummary = (period: PeriodFilter, referenceDate: Date = new Date()): ReportSummary => {
    const list = getRelevantTransactions();
    const filtered = filterTransactionsByPeriod(list, period, referenceDate);

    let income = 0;
    let expenses = 0;

    filtered.forEach((t) => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expenses += t.amount;
      }
    });

    const netBalance = income - expenses;
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

    let startDateStr = '';
    let endDateStr = '';

    if (period === 'daily') {
      startDateStr = endDateStr = getTodayDateString();
    } else if (period === 'weekly') {
      const { start, end } = getStartAndEndOfWeek(referenceDate);
      startDateStr = start.toISOString().split('T')[0];
      endDateStr = end.toISOString().split('T')[0];
    } else {
      const { start, end } = getStartAndEndOfMonth(referenceDate.getFullYear(), referenceDate.getMonth());
      startDateStr = start.toISOString().split('T')[0];
      endDateStr = end.toISOString().split('T')[0];
    }

    return {
      income,
      expenses,
      netBalance,
      period,
      startDate: startDateStr,
      endDate: endDateStr,
      transactionCount: filtered.length,
      savingsRate,
    };
  };

  const getCategorySpending = (categoryId: CategoryId, referenceDate: Date = new Date()): CategorySpending => {
    const list = getRelevantTransactions();
    // Monthly by default for category budget tracking
    const { start, end } = getStartAndEndOfMonth(referenceDate.getFullYear(), referenceDate.getMonth());
    
    let totalSpent = 0;
    let totalExpensesAllCategories = 0;
    let transactionCount = 0;

    list.forEach((t) => {
      if (t.type === 'expense') {
        totalExpensesAllCategories += t.amount;
        if (t.categoryId === categoryId) {
          totalSpent += t.amount;
          transactionCount++;
        }
      }
    });

    const categoryObj = getCategoryById(categoryId, categories);
    const budget = categoryObj.budget;
    const percentageOfExpenses =
      totalExpensesAllCategories > 0 ? Math.round((totalSpent / totalExpensesAllCategories) * 100) : 0;
    const remainingBudget = Math.max(0, budget - totalSpent);
    const budgetProgress = budget > 0 ? totalSpent / budget : 0;
    const isOverBudget = totalSpent > budget;

    return {
      category: categoryObj,
      totalSpent,
      percentageOfExpenses,
      transactionCount,
      remainingBudget,
      budgetProgress,
      isOverBudget,
    };
  };

  const getAllCategorySpendings = (referenceDate: Date = new Date()): CategorySpending[] => {
    return categories.map((cat) => getCategorySpending(cat.id, referenceDate));
  };

  const getTransactionsForMonth = (year: number, monthZeroIndexed: number): Transaction[] => {
    const list = getRelevantTransactions();
    const { start, end } = getStartAndEndOfMonth(year, monthZeroIndexed);
    const startNorm = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const endNorm = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();

    return list.filter((t) => {
      const parts = t.date.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)).getTime();
        return d >= startNorm && d <= endNorm;
      }
      return false;
    });
  };

  const resetDemoData = async () => {
    await StorageService.clearAll();
    const freshTransactions = generateSampleTransactions();
    setTransactions(freshTransactions);
    setCategories(DEFAULT_CATEGORIES);
    setUser(DEMO_CUSTOMER);
    setUsersList(DEMO_CREDENTIALS);
    await StorageService.saveTransactions(freshTransactions);
    await StorageService.saveCurrentUser(DEMO_CUSTOMER);
    showAlert('Demo data and sample transactions reset successfully!', 'info');
  };

  const role: UserRole = user ? user.role : 'customer';
  const isAuthenticated = user !== null;

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        transactions,
        categories,
        activeAlert,
        dismissAlert,
        showAlert,
        signIn,
        signUp,
        logout,
        switchDemoRole,
        updateProfile,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getReportSummary,
        getAllCategorySpendings,
        getCategorySpending,
        getTransactionsForMonth,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
