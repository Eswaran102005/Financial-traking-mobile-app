import { PeriodFilter, Transaction } from '../types';

export const isSameDay = (dateStr1: string, dateStr2: string): boolean => {
  return dateStr1 === dateStr2;
};

export const getStartAndEndOfWeek = (refDate: Date = new Date()): { start: Date; end: Date } => {
  const d = new Date(refDate);
  const day = d.getDay();
  // Adjust so Monday is 0, Sunday is 6
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d.setDate(diffToMonday));
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getStartAndEndOfMonth = (year: number, monthZeroIndexed: number): { start: Date; end: Date } => {
  const start = new Date(year, monthZeroIndexed, 1, 0, 0, 0, 0);
  const end = new Date(year, monthZeroIndexed + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

export const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date(dateStr);
};

export const isDateInRange = (dateStr: string, start: Date, end: Date): boolean => {
  const d = parseDateString(dateStr);
  const startNorm = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endNorm = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  const dNorm = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return dNorm >= startNorm && dNorm <= endNorm;
};

export const filterTransactionsByPeriod = (
  transactions: Transaction[],
  period: PeriodFilter,
  referenceDate: Date = new Date()
): Transaction[] => {
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();
  const todayStr = `${refYear}-${String(refMonth + 1).padStart(2, '0')}-${String(referenceDate.getDate()).padStart(2, '0')}`;

  if (period === 'daily') {
    return transactions.filter((t) => t.date === todayStr);
  }

  if (period === 'weekly') {
    const { start, end } = getStartAndEndOfWeek(referenceDate);
    return transactions.filter((t) => isDateInRange(t.date, start, end));
  }

  if (period === 'monthly') {
    const { start, end } = getStartAndEndOfMonth(refYear, refMonth);
    return transactions.filter((t) => isDateInRange(t.date, start, end));
  }

  return transactions;
};
