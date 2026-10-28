import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Plus,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Wallet,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { CategoryIcon } from '../components/CategoryIcon';
import { TransactionItem } from '../components/TransactionItem';
import { CategoryId } from '../types';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const CategoryDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { categoryId } = route.params as { categoryId: CategoryId };
  const { getCategorySpending, transactions, deleteTransaction } = useApp();

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 4,
    duration: 380,
    staggerDelay: 70,
    offsetDistance: 38,
    initialOpacity: 0.8,
  });

  const categoryData = getCategorySpending(categoryId || 'food');
  const { category, totalSpent, percentageOfExpenses, remainingBudget, isOverBudget } =
    categoryData;

  // Filter transactions related to this category
  const relatedTransactions = transactions.filter((t) => t.categoryId === category.id);

  const progressPercent = Math.min(100, Math.round((totalSpent / category.budget) * 100));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header: slide in from left */}
      <Animated.View style={[styles.header, getSlideStyle(0, 'left')]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Back to categories"
        >
          <ArrowLeft size={22} color={PALETTE.deepBlack} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {category.name}
        </Text>
        <Pressable
          onPress={() =>
            navigation.navigate('AddTransaction', { prefillCategoryId: category.id })
          }
          style={styles.addMiniButton}
          accessibilityLabel="Add expense to category"
        >
          <Plus size={18} color={PALETTE.offWhite} />
        </Pressable>
      </Animated.View>

      {/* Category Content & Transactions: slide in from right */}
      <Animated.View style={[{ flex: 1 }, getSlideStyle(1, 'right')]}>
        <FlatList
          data={relatedTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              showActions={true}
              onEdit={(tx) =>
                navigation.navigate('AddTransaction', { editTransactionId: tx.id })
              }
              onDelete={(id) => deleteTransaction(id)}
            />
          )}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Category Hero Card */}
            <View style={styles.heroCard}>
              <CategoryIcon
                iconName={category.iconName}
                color={category.color}
                bgColor={category.bgColor}
                containerSize={64}
                size={30}
              />
              <Text style={styles.categoryNameText}>{category.name}</Text>
              <Text style={styles.totalSpentText}>{formatCurrency(totalSpent)}</Text>
              <Text style={styles.spentSubtext}>Total Spent Across Records</Text>

              {/* Status Badge */}
              <View
                style={[
                  styles.statusBadge,
                  isOverBudget ? styles.statusBadgeDanger : styles.statusBadgeSafe,
                ]}
              >
                {isOverBudget ? (
                  <AlertTriangle size={14} color={COLORS.expense} />
                ) : (
                  <CheckCircle2 size={14} color={COLORS.incomeDark} />
                )}
                <Text
                  style={[
                    styles.statusBadgeText,
                    isOverBudget ? styles.statusBadgeTextDanger : styles.statusBadgeTextSafe,
                  ]}
                >
                  {isOverBudget ? 'Budget Exceeded!' : 'Within Budget Limit'}
                </Text>
              </View>

              {/* Budget Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${progressPercent}%`,
                        backgroundColor: isOverBudget ? COLORS.expense : PALETTE.darkNavy,
                      },
                    ]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabelText}>{progressPercent}% utilized</Text>
                  <Text style={styles.progressLabelText}>
                    Budget: {formatCurrency(category.budget)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Metrics Dual Cards */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <View style={styles.metricIconBox}>
                  <PieChart size={18} color={PALETTE.darkNavy} />
                </View>
                <Text style={styles.metricLabel}>Share of Spending</Text>
                <Text style={styles.metricVal}>{percentageOfExpenses}%</Text>
                <Text style={styles.metricSub}>of overall expenses</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricIconBox}>
                  <Wallet size={18} color={COLORS.income} />
                </View>
                <Text style={styles.metricLabel}>Remaining Budget</Text>
                <Text
                  style={[
                    styles.metricVal,
                    { color: isOverBudget ? COLORS.expense : COLORS.income },
                  ]}
                >
                  {formatCurrency(remainingBudget)}
                </Text>
                <Text style={styles.metricSub}>
                  {isOverBudget ? '0 balance left' : 'available to spend'}
                </Text>
              </View>
            </View>

            {/* Quick Add Button */}
            <Pressable
              onPress={() =>
                navigation.navigate('AddTransaction', { prefillCategoryId: category.id })
              }
              style={styles.addExpenseButton}
            >
              <Plus size={18} color={PALETTE.offWhite} />
              <Text style={styles.addExpenseButtonText}>Add {category.name} Expense</Text>
            </Pressable>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Related Transactions ({relatedTransactions.length})
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Transactions Recorded</Text>
            <Text style={styles.emptyText}>
              You haven't recorded any expenses or income under {category.name} yet.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      </Animated.View>
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
  backButton: {
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  addMiniButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PALETTE.darkNavy,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  headerContainer: {
    paddingTop: SPACING.md,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.md,
  },
  categoryNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: PALETTE.deepBlack,
    marginTop: SPACING.md,
  },
  totalSpentText: {
    fontSize: 32,
    fontWeight: '800',
    color: PALETTE.deepBlack,
    marginTop: 4,
  },
  spentSubtext: {
    fontSize: 12,
    color: PALETTE.slateBlue,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: SPACING.md,
  },
  statusBadgeSafe: {
    backgroundColor: COLORS.incomeBg,
  },
  statusBadgeDanger: {
    backgroundColor: COLORS.expenseBg,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadgeTextSafe: {
    color: COLORS.incomeDark,
  },
  statusBadgeTextDanger: {
    color: COLORS.expense,
  },
  progressContainer: {
    width: '100%',
    marginTop: SPACING.lg,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: PALETTE.lightSlate,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressLabelText: {
    fontSize: 11,
    color: PALETTE.slateBlue,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.sm,
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PALETTE.offWhite,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: PALETTE.slateBlue,
    fontWeight: '500',
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '800',
    color: PALETTE.deepBlack,
    marginTop: 2,
  },
  metricSub: {
    fontSize: 10,
    color: PALETTE.slateBlue,
    marginTop: 2,
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.darkNavy, // #24303E primary button
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  addExpenseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: PALETTE.offWhite, // #F8FAFC text
  },
  sectionHeader: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.deepBlack,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  emptyContainer: {
    padding: SPACING.xxxl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.deepBlack,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: PALETTE.slateBlue,
    textAlign: 'center',
  },
});
