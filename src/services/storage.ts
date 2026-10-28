import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Transaction, Category } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: '@fintrack_current_user',
  USERS_LIST: '@fintrack_users_list',
  TRANSACTIONS: '@fintrack_transactions',
  CATEGORIES: '@fintrack_categories',
};

export const StorageService = {
  async saveCurrentUser(user: User | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Failed to save current user to AsyncStorage', e);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to get current user from AsyncStorage', e);
      return null;
    }
  },

  async saveUsersList(users: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save users list', e);
    }
  },

  async getUsersList(): Promise<any[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS_LIST);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to get users list', e);
      return null;
    }
  },

  async saveTransactions(transactions: Transaction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed to save transactions to AsyncStorage', e);
    }
  },

  async getTransactions(): Promise<Transaction[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to get transactions from AsyncStorage', e);
      return null;
    }
  },

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to save categories to AsyncStorage', e);
    }
  },

  async getCategories(): Promise<Category[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to get categories from AsyncStorage', e);
      return null;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CURRENT_USER,
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.CATEGORIES,
      ]);
    } catch (e) {
      console.warn('Failed to clear AsyncStorage', e);
    }
  },
};
