import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  ShieldAlert,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TransactionItem } from '../components/TransactionItem';
import { Transaction } from '../types';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const MonthWiseTransactionsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { role, getTransactionsForMonth, deleteTransaction } = useApp();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 8,
    duration: 380,
    staggerDelay: 70,
    offsetDistance: 38,
    initialOpacity: 0.8,
  });

  // Role Guard
  if (role !== 'customer') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.guardContainer}>
          <ShieldAlert size={48} color={PALETTE.darkNavy} />
          <Text style={styles.guardTitle}>Customer Screen Only</Text>
          <Text style={styles.guardDescription}>
            Month-wise transaction management and records are accessible to Customer accounts.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get transactions for selected month/year
  const monthTransactions = getTransactionsForMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // Calculate monthly totals
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  monthTransactions.forEach((t) => {
    if (t.type === 'income') {
      monthlyIncome += t.amount;
    } else {
      monthlyExpense += t.amount;
    }
  });

  const monthlyNet = monthlyIncome - monthlyExpense;

  // Filter transactions based on type and search query
  const filteredTransactions = monthTransactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Navigate months
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  const handleEdit = (tx: Transaction) => {
    navigation.navigate('AddTransaction', { editTransactionId: tx.id });
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

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
          <Text style={styles.headerTitle}>Transactions</Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate('AddTransaction', {})}
          style={styles.addButton}
          accessibilityLabel="Add new transaction"
        >
          <Plus size={16} color={PALETTE.offWhite} />
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </Animated.View>

      {/* Month & Year Navigation Carousel: slide in from right */}
      <Animated.View style={[styles.monthSelectorRow, getSlideStyle(1, 'right')]}>
        <Pressable
          onPress={goToPreviousMonth}
          style={styles.monthNavButton}
          accessibilityLabel="Previous month"
        >
          <ChevronLeft size={20} color={PALETTE.deepBlack} />
        </Pressable>

        <View style={styles.monthLabelContainer}>
          <Calendar size={16} color={PALETTE.darkNavy} />
          <Text style={styles.monthLabelText}>{formatMonthYear(currentDate)}</Text>
        </View>

        <Pressable
          onPress={goToNextMonth}
          style={styles.monthNavButton}
          accessibilityLabel="Next month"
        >
          <ChevronRight size={20} color={PALETTE.deepBlack} />
        </Pressable>
      </Animated.View>

      {/* Monthly Financial Summary Bar: slide in from left */}
      <Animated.View style={[styles.summaryCard, getSlideStyle(2, 'left')]}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryHeader}>
            <ArrowUpRight size={14} color={COLORS.income} />
            <Text style={styles.summaryLabel}>Income</Text>
          </View>
          <Text style={styles.summaryIncomeVal}>{formatCurrency(monthlyIncome)}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <View style={styles.summaryHeader}>
            <ArrowDownLeft size={14} color={COLORS.expense} />
            <Text style={styles.summaryLabel}>Expense</Text>
          </View>
          <Text style={styles.summaryExpenseVal}>{formatCurrency(monthlyExpense)}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net Balance</Text>
          <Text style={[styles.summaryNetVal, monthlyNet < 0 && styles.negativeNet]}>
            {formatCurrency(monthlyNet)}
          </Text>
        </View>
      </Animated.View>

      {/* Search Input & Filters: slide in from right */}
      <Animated.View style={[styles.searchAndFilterSection, getSlideStyle(3, 'right')]}>
        <View style={styles.searchBar}>
          <Search size={18} color={PALETTE.slateBlue} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search transactions..."
            placeholderTextColor={PALETTE.slateBlue}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filtersRow}>
          {(['all', 'income', 'expense'] as const).map((filter) => {
            const isActive = filterType === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setFilterType(filter)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {filter === 'all' ? 'All' : filter === 'income' ? 'Income' : 'Expenses'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* Transactions List: slide in from left */}
      <Animated.View style={[{ flex: 1 }, getSlideStyle(4, 'left')]}>
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPress={() => handleEdit(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? 'Try a different search query'
                  : `No records for ${formatMonthYear(currentDate)}.`}
              </Text>
              <Pressable
                onPress={() => navigation.navigate('AddTransaction', {})}
                style={styles.addFirstButton}
              >
                <Text style={styles.addFirstButtonText}>+ Add Transaction</Text>
              </Pressable>
            </View>
          }
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
    fontSize: 20,
    fontWeight: '800',
    color: PALETTE.deepBlack,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    ...SHADOWS.sm,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.offWhite,
  },
  monthSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  monthLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.sm,
  },
  monthLabelText: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.deepBlack,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.sm,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: PALETTE.lightSlate,
    alignSelf: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 11,
    color: PALETTE.slateBlue,
    fontWeight: '500',
  },
  summaryIncomeVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.income,
  },
  summaryExpenseVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.expense,
  },
  summaryNetVal: {
    fontSize: 14,
    fontWeight: '700',
    color: PALETTE.deepBlack,
  },
  negativeNet: {
    color: COLORS.expense,
  },
  searchAndFilterSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: PALETTE.deepBlack,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  filterChipActive: {
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy
    borderColor: PALETTE.darkNavy,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.slateBlue,
  },
  filterChipTextActive: {
    color: PALETTE.offWhite,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 110,
    paddingTop: 4,
  },
  emptyContainer: {
    padding: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.deepBlack,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: PALETTE.slateBlue,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  addFirstButton: {
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: RADIUS.full,
  },
  addFirstButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.darkNavy,
  },
  guardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  guardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: PALETTE.deepBlack,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  guardDescription: {
    fontSize: 14,
    color: PALETTE.slateBlue,
    textAlign: 'center',
    lineHeight: 20,
  },
});
