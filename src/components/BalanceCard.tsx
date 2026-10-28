import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Shield, User as UserIcon } from 'lucide-react-native';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { PeriodFilter, UserRole } from '../types';

interface BalanceCardProps {
  income: number;
  expenses: number;
  netBalance: number;
  period: PeriodFilter;
  role: UserRole;
  userName?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  income,
  expenses,
  netBalance,
  period,
  role,
  userName = 'User',
}) => {
  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        return "Today's Balance";
      case 'weekly':
        return "This Week's Balance";
      case 'monthly':
      default:
        return "This Month's Balance";
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.roleBadge}>
          {role === 'admin' ? (
            <Shield size={13} color={PALETTE.lightSlate} />
          ) : (
            <UserIcon size={13} color={PALETTE.lightSlate} />
          )}
          <Text style={styles.roleText}>
            {role === 'admin' ? 'Admin Overview' : `${userName}`}
          </Text>
        </View>

        <View style={styles.periodPill}>
          <Text style={styles.periodPillText}>{getPeriodLabel()}</Text>
        </View>
      </View>

      {/* Main Net Balance */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Total Net Balance</Text>
        <Text style={[styles.balanceAmount, netBalance < 0 && styles.negativeBalance]}>
          {formatCurrency(netBalance)}
        </Text>
      </View>

      {/* Income and Expense KPI Row */}
      <View style={styles.kpiRow}>
        {/* Income */}
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(5, 150, 105, 0.20)' }]}>
            <ArrowUpRight size={18} color="#34D399" />
          </View>
          <View style={styles.kpiTextContainer}>
            <Text style={styles.kpiLabel}>Total Income</Text>
            <Text style={styles.incomeValue}>{formatCurrency(income, true, 'income')}</Text>
          </View>
        </View>

        <View style={styles.kpiDivider} />

        {/* Expense */}
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(220, 38, 38, 0.20)' }]}>
            <ArrowDownLeft size={18} color="#F87171" />
          </View>
          <View style={styles.kpiTextContainer}>
            <Text style={styles.kpiLabel}>Total Expense</Text>
            <Text style={styles.expenseValue}>{formatCurrency(expenses, true, 'expense')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy for balance card
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    ...SHADOWS.cardDark,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(11, 15, 20, 0.40)', // Deep Black tint
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.20)',
  },
  roleText: {
    color: PALETTE.lightSlate,
    fontSize: 12,
    fontWeight: '600',
  },
  periodPill: {
    backgroundColor: 'rgba(100, 116, 139, 0.30)', // Slate Blue tint
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.30)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  periodPillText: {
    color: PALETTE.offWhite,
    fontSize: 11,
    fontWeight: '600',
  },
  balanceSection: {
    marginBottom: SPACING.xl,
  },
  balanceLabel: {
    color: PALETTE.lightSlate, // #CBD5E1 secondary on dark
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    color: PALETTE.offWhite, // #F8FAFC primary on dark
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  negativeBalance: {
    color: '#F87171',
  },
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 15, 20, 0.35)', // Deep Black subtle container
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.15)',
  },
  kpiCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  kpiDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(203, 213, 225, 0.20)',
    marginHorizontal: SPACING.xs,
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTextContainer: {
    flex: 1,
  },
  kpiLabel: {
    color: PALETTE.lightSlate,
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  incomeValue: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '700',
  },
  expenseValue: {
    color: '#F87171',
    fontSize: 14,
    fontWeight: '700',
  },
});
