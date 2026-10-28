import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Edit2, Trash2 } from 'lucide-react-native';
import { Transaction } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { getCategoryById } from '../constants/categories';
import { formatCurrency, formatDate } from '../utils/formatters';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const category = getCategoryById(transaction.categoryId);
  const isIncome = transaction.type === 'income';

  const confirmDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.title}"? This will recalculate all affected financial totals.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete && onDelete(transaction.id),
        },
      ]
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.leftSection}>
        <CategoryIcon
          iconName={isIncome ? 'income' : category.iconName}
          color={isIncome ? COLORS.income : category.color}
          bgColor={isIncome ? COLORS.incomeBg : category.bgColor}
          containerSize={44}
          size={20}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {transaction.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, { backgroundColor: category.bgColor }]}>
              <Text style={[styles.categoryBadgeText, { color: category.color }]}>
                {category.name}
              </Text>
            </View>
            <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, isIncome ? styles.incomeAmount : styles.expenseAmount]}>
          {formatCurrency(transaction.amount, true, transaction.type)}
        </Text>

        {showActions && (
          <View style={styles.actionsRow}>
            {onEdit && (
              <Pressable
                onPress={() => onEdit(transaction)}
                hitSlop={6}
                style={styles.iconButton}
                accessibilityLabel="Edit transaction"
              >
                <Edit2 size={14} color={PALETTE.darkNavy} />
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                onPress={confirmDelete}
                hitSlop={6}
                style={[styles.iconButton, styles.deleteButton]}
                accessibilityLabel="Delete transaction"
              >
                <Trash2 size={14} color="#DC2626" />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: 4,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate, // #CBD5E1 subtle border
    ...SHADOWS.sm,
  },
  pressed: {
    backgroundColor: PALETTE.offWhite,
    transform: [{ scale: 0.995 }],
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.deepBlack, // #0B0F14 Primary text
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.4)',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: PALETTE.slateBlue, // #64748B Secondary text
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
  incomeAmount: {
    color: COLORS.income,
  },
  expenseAmount: {
    color: COLORS.expense,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  iconButton: {
    padding: 5,
    borderRadius: RADIUS.xs,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
});
