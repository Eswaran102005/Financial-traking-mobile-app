import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight, AlertCircle } from 'lucide-react-native';
import { CategorySpending } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface CategoryProgressCardProps {
  item: CategorySpending;
  onPress: () => void;
}

export const CategoryProgressCard: React.FC<CategoryProgressCardProps> = ({
  item,
  onPress,
}) => {
  const { category, totalSpent, budgetProgress, isOverBudget, transactionCount } = item;
  const progressPercent = Math.min(100, Math.round(budgetProgress * 100));

  const getBarColor = () => {
    if (isOverBudget) return COLORS.expense;
    if (progressPercent > 80) return COLORS.warning;
    return PALETTE.darkNavy; // Dark Navy for healthy progress
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <CategoryIcon
            iconName={category.iconName}
            color={category.color}
            bgColor={category.bgColor}
            containerSize={48}
            size={22}
          />
          <View style={styles.titles}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.transactionCount}>
              {transactionCount} {transactionCount === 1 ? 'transaction' : 'transactions'}
            </Text>
          </View>
        </View>

        <View style={styles.rightInfo}>
          <Text style={styles.spentAmount}>{formatCurrency(totalSpent)}</Text>
          <View style={styles.budgetLimitRow}>
            <Text style={styles.budgetLimit}>of {formatCurrency(category.budget)}</Text>
            <ChevronRight size={16} color={PALETTE.slateBlue} />
          </View>
        </View>
      </View>

      {/* Progress Bar Container */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: getBarColor(),
              },
            ]}
          />
        </View>

        <View style={styles.progressLabels}>
          <Text style={[styles.progressText, isOverBudget && styles.overBudgetText]}>
            {progressPercent}% spent
          </Text>
          {isOverBudget ? (
            <View style={styles.overBudgetBadge}>
              <AlertCircle size={12} color={COLORS.expense} />
              <Text style={styles.overBudgetBadgeText}>Over Budget</Text>
            </View>
          ) : (
            <Text style={styles.remainingText}>
              {formatCurrency(category.budget - totalSpent)} left
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate, // #CBD5E1 subtle border
    ...SHADOWS.sm,
  },
  cardPressed: {
    backgroundColor: PALETTE.offWhite,
    transform: [{ scale: 0.995 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  titles: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.deepBlack, // #0B0F14 Primary text
    marginBottom: 2,
  },
  transactionCount: {
    fontSize: 12,
    color: PALETTE.slateBlue, // #64748B Secondary text
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  spentAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.deepBlack, // #0B0F14 Primary text
  },
  budgetLimitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  budgetLimit: {
    fontSize: 12,
    color: PALETTE.slateBlue, // #64748B Secondary text
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 7,
    backgroundColor: '#E2E8F0',
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
    alignItems: 'center',
    marginTop: 6,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.slateBlue,
  },
  overBudgetText: {
    color: COLORS.expense,
    fontWeight: '700',
  },
  overBudgetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.expenseBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  overBudgetBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.expense,
  },
  remainingText: {
    fontSize: 11,
    color: PALETTE.slateBlue,
    fontWeight: '500',
  },
});
