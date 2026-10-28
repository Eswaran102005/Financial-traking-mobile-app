import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Menu,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  Shield,
  Sparkles,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { PeriodSelector } from '../components/PeriodSelector';
import { FinancialChart } from '../components/FinancialChart';
import { CategoryDonutChart } from '../components/CategoryDonutChart';
import { PeriodFilter } from '../types';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const AnalysisScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, role, transactions, getReportSummary, getAllCategorySpendings } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('monthly');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 8,
    duration: 380,
    staggerDelay: 70,
    offsetDistance: 38,
    initialOpacity: 0.8,
  });

  const report = getReportSummary(selectedPeriod);
  const categorySpendings = getAllCategorySpendings();

  // Find top spending category
  const sortedSpendings = [...categorySpendings].sort((a, b) => b.totalSpent - a.totalSpent);
  const topCategory = sortedSpendings[0]?.totalSpent > 0 ? sortedSpendings[0] : null;

  // Filter transactions for chart according to typeFilter if chosen
  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter === 'all') return true;
    return t.type === typeFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header: slide in from left */}
      <Animated.View style={[styles.header, getSlideStyle(0, 'left')]}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={styles.menuButton}
            accessibilityLabel="Open navigation drawer"
          >
            <Menu size={22} color={PALETTE.deepBlack} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Financial Analysis</Text>
            <Text style={styles.headerSubtitle}>
              {role === 'admin' ? 'System Demo Overview' : `${user?.name || 'Customer'}'s Analytics`}
            </Text>
          </View>
        </View>

        <View style={styles.roleTag}>
          {role === 'admin' ? (
            <Shield size={14} color={PALETTE.darkNavy} />
          ) : (
            <Sparkles size={14} color={PALETTE.darkNavy} />
          )}
          <Text style={styles.roleTagText}>{role.toUpperCase()}</Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector Tabs & Filters: slide in from right */}
        <Animated.View style={getSlideStyle(1, 'right')}>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onSelectPeriod={(p) => setSelectedPeriod(p)}
          />

          {/* Transaction Type Filters */}
          <View style={styles.filterPillsRow}>
            {(['all', 'expense', 'income'] as const).map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setTypeFilter(filter)}
                style={[styles.filterPill, typeFilter === filter && styles.filterPillActive]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    typeFilter === filter && styles.filterPillTextActive,
                  ]}
                >
                  {filter === 'all' ? 'All Types' : filter === 'expense' ? 'Expenses' : 'Incomes'}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Financial KPI Summary Cards: slide in from left */}
        <Animated.View style={[styles.kpiContainer, getSlideStyle(2, 'left')]}>
          {/* Net Balance Card in Dark Navy */}
          <View style={styles.netCard}>
            <Text style={styles.kpiCardLabel}>Net Balance ({selectedPeriod})</Text>
            <Text style={[styles.netAmount, report.netBalance < 0 && styles.negativeAmount]}>
              {formatCurrency(report.netBalance)}
            </Text>
            <View style={styles.savingsPill}>
              <TrendingUp size={12} color="#34D399" />
              <Text style={styles.savingsPillText}>
                {report.savingsRate}% Savings Ratio
              </Text>
            </View>
          </View>

          {/* Income & Expense Dual Grid */}
          <View style={styles.dualGrid}>
            <View style={styles.miniKpiCard}>
              <View style={styles.miniKpiHeader}>
                <ArrowUpRight size={16} color={COLORS.income} />
                <Text style={styles.miniKpiLabel}>Income</Text>
              </View>
              <Text style={styles.incomeVal}>{formatCurrency(report.income)}</Text>
            </View>

            <View style={styles.miniKpiCard}>
              <View style={styles.miniKpiHeader}>
                <ArrowDownLeft size={16} color={COLORS.expense} />
                <Text style={styles.miniKpiLabel}>Expense</Text>
              </View>
              <Text style={styles.expenseVal}>{formatCurrency(report.expenses)}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Key Insight Card: slide in from right */}
        {topCategory && (
          <Animated.View style={[styles.insightCard, getSlideStyle(3, 'right')]}>
            <View style={styles.insightIconBox}>
              <PieChart size={20} color={PALETTE.darkNavy} />
            </View>
            <View style={styles.insightTextContent}>
              <Text style={styles.insightTitle}>Top Spending Sector</Text>
              <Text style={styles.insightDescription}>
                <Text style={{ fontWeight: '700', color: PALETTE.deepBlack }}>
                  {topCategory.category.name}
                </Text>{' '}
                accounts for{' '}
                <Text style={{ fontWeight: '700', color: COLORS.expense }}>
                  {topCategory.percentageOfExpenses}%
                </Text>{' '}
                ({formatCurrency(topCategory.totalSpent)}) of your total spending.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Income vs Expense Bar Chart: slide in from left */}
        <Animated.View style={getSlideStyle(4, 'left')}>
          <FinancialChart transactions={filteredTransactions} period={selectedPeriod} />
        </Animated.View>

        {/* Category-wise Spending Breakdown Donut Chart: slide in from right */}
        <Animated.View style={getSlideStyle(5, 'right')}>
          <CategoryDonutChart categorySpendings={categorySpendings} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.offWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: PALETTE.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.lightSlate,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: PALETTE.deepBlack,
  },
  headerSubtitle: {
    fontSize: 11,
    color: PALETTE.slateBlue,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PALETTE.offWhite,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.darkNavy,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 110,
    paddingTop: SPACING.sm,
  },
  filterPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: SPACING.xs,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: PALETTE.offWhite,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  filterPillActive: {
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy active
    borderColor: PALETTE.darkNavy,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.slateBlue, // #64748B
  },
  filterPillTextActive: {
    color: PALETTE.offWhite, // #F8FAFC
    fontWeight: '700',
  },
  kpiContainer: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  netCard: {
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.cardDark,
  },
  kpiCardLabel: {
    fontSize: 11,
    color: PALETTE.lightSlate, // #CBD5E1
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  netAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: PALETTE.offWhite, // #F8FAFC
    marginVertical: 4,
  },
  negativeAmount: {
    color: '#F87171',
  },
  savingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(5, 150, 105, 0.20)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  savingsPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  dualGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  miniKpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate, // #CBD5E1
    ...SHADOWS.sm,
  },
  miniKpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  miniKpiLabel: {
    fontSize: 12,
    color: PALETTE.slateBlue, // #64748B
    fontWeight: '500',
  },
  incomeVal: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.income,
  },
  expenseVal: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.expense,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.sm,
  },
  insightIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.offWhite,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTextContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.deepBlack,
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: 12,
    color: PALETTE.slateBlue,
    lineHeight: 17,
  },
});
