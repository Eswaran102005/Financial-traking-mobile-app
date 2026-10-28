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
  PlusCircle,
  Receipt,
  Grid,
  BarChart3,
  Shield,
  ArrowRight,
  LogIn,
  UserPlus,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { BalanceCard } from '../components/BalanceCard';
import { PeriodSelector } from '../components/PeriodSelector';
import { TransactionItem } from '../components/TransactionItem';
import { FinancialChart } from '../components/FinancialChart';
import { PeriodFilter } from '../types';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, role, transactions, getReportSummary } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('monthly');

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 14,
    duration: 380,
    staggerDelay: 70,
    offsetDistance: 38,
    initialOpacity: 0.8,
  });

  // Compute report based on currently selected period
  const report = getReportSummary(selectedPeriod);

  // Filter recent transactions
  const recentTransactions = transactions.slice(0, 5);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* 1. Dashboard Header and Greeting: slide in from the left */}
      <Animated.View style={[styles.header, getSlideStyle(0, 'left')]}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={openDrawer}
            style={styles.menuButton}
            accessibilityLabel="Open navigation drawer"
          >
            <Menu size={22} color={PALETTE.deepBlack} />
          </Pressable>
          <View>
            <Text style={styles.appBranding}>FinTrack</Text>
            <Text style={styles.appSubtitle}>Smart Budget & Finance</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {role === 'admin' ? (
            <View style={styles.adminIndicator}>
              <Shield size={13} color={PALETTE.darkNavy} />
              <Text style={styles.adminIndicatorText}>Admin</Text>
            </View>
          ) : (
            <Pressable
              onPress={() => navigation.navigate('TabNavigator', { screen: 'ProfileTab' })}
              style={styles.avatarPill}
            >
              <Text style={styles.avatarPillText}>
                {user?.name ? user.name.substring(0, 1).toUpperCase() : 'U'}
              </Text>
            </Pressable>
          )}
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Auth Entry Points (shown only when not authenticated) */}
        {!user && (
          <Animated.View style={[styles.authBanner, getSlideStyle(1, 'right')]}>
            <Text style={styles.authBannerText}>
              Browsing as <Text style={{ fontWeight: '700', color: PALETTE.deepBlack }}>Guest</Text>
            </Text>
            <View style={styles.authButtonsRow}>
              <Pressable
                onPress={() => navigation.navigate('SignIn')}
                style={styles.authMiniButton}
              >
                <LogIn size={13} color={PALETTE.darkNavy} />
                <Text style={styles.authMiniButtonText}>Sign In</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('SignUp')}
                style={[styles.authMiniButton, styles.authMiniButtonFilled]}
              >
                <UserPlus size={13} color={PALETTE.offWhite} />
                <Text style={styles.authMiniButtonTextWhite}>Sign Up</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* 4. Daily, Weekly, and Monthly Report Section: slide in from the left */}
        <Animated.View style={[styles.periodSection, getSlideStyle(1, 'left')]}>
          <Text style={styles.periodHeaderLabel}>Financial Period Report</Text>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onSelectPeriod={(p) => setSelectedPeriod(p)}
          />
        </Animated.View>

        {/* 2. Total Balance Card: slide in from the right */}
        <Animated.View style={getSlideStyle(2, 'right')}>
          <BalanceCard
            income={report.income}
            expenses={report.expenses}
            netBalance={report.netBalance}
            period={selectedPeriod}
            role={role}
            userName={user?.name}
          />
        </Animated.View>

        {/* 3. Income & Expense Statistics Summary Card: slide in from the left */}
        <Animated.View style={[styles.statsSummaryCard, getSlideStyle(3, 'left')]}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>{report.transactionCount}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Savings Rate</Text>
            <Text
              style={[
                styles.statValue,
                { color: report.savingsRate >= 0 ? COLORS.income : COLORS.expense },
              ]}
            >
              {report.savingsRate}%
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Mode</Text>
            <Text style={[styles.statValue, { color: PALETTE.darkNavy }]}>
              {selectedPeriod.toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        {/* Quick Action Navigation Grid: slide in from the right */}
        <Animated.View style={[styles.quickActionsContainer, getSlideStyle(4, 'right')]}>
          {role === 'customer' && (
            <Pressable
              onPress={() => navigation.navigate('AddTransaction', {})}
              style={[styles.actionCard, { backgroundColor: PALETTE.darkNavy }]}
            >
              <PlusCircle size={20} color={PALETTE.offWhite} />
              <Text style={styles.actionCardTextWhite}>Add Expense</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => navigation.navigate('TabNavigator', { screen: 'AnalysisTab' })}
            style={[styles.actionCard, styles.actionCardLight]}
          >
            <BarChart3 size={19} color={PALETTE.darkNavy} />
            <Text style={styles.actionCardText}>Analysis</Text>
          </Pressable>

          {role === 'customer' && (
            <Pressable
              onPress={() => navigation.navigate('TabNavigator', { screen: 'CategoriesTab' })}
              style={[styles.actionCard, styles.actionCardLight]}
            >
              <Grid size={19} color={PALETTE.darkNavy} />
              <Text style={styles.actionCardText}>Categories</Text>
            </Pressable>
          )}

          {role === 'customer' && (
            <Pressable
              onPress={() => navigation.navigate('TabNavigator', { screen: 'TransactionsTab' })}
              style={[styles.actionCard, styles.actionCardLight]}
            >
              <Receipt size={19} color={PALETTE.darkNavy} />
              <Text style={styles.actionCardText}>History</Text>
            </Pressable>
          )}
        </Animated.View>

        {/* 5. Financial Charts: slide in from the right */}
        <Animated.View style={getSlideStyle(5, 'right')}>
          <FinancialChart transactions={transactions} period={selectedPeriod} />
        </Animated.View>

        {/* 6. Recent Transaction Section Header: slide in from the left */}
        <Animated.View style={getSlideStyle(6, 'left')}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {role === 'customer' ? (
              <Pressable
                onPress={() => navigation.navigate('TabNavigator', { screen: 'TransactionsTab' })}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>View All</Text>
                <ArrowRight size={14} color={PALETTE.darkNavy} />
              </Pressable>
            ) : (
              <Text style={styles.adminNote}>Admin Aggregate View</Text>
            )}
          </View>
        </Animated.View>

        {/* 7. Individual Transaction Rows: subtle staggered entrance alternating directions */}
        {recentTransactions.length > 0 ? (
          recentTransactions.map((tx, idx) => (
            <Animated.View
              key={tx.id}
              style={getSlideStyle(7 + idx, idx % 2 === 0 ? 'right' : 'left', 26)}
            >
              <TransactionItem
                transaction={tx}
                showActions={false}
                onPress={() => {
                  if (role === 'customer') {
                    navigation.navigate('AddTransaction', { editTransactionId: tx.id });
                  }
                }}
              />
            </Animated.View>
          ))
        ) : (
          <Animated.View style={[styles.emptyContainer, getSlideStyle(7, 'left')]}>
            <Text style={styles.emptyText}>No transactions recorded yet.</Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.offWhite, // #F8FAFC
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
    borderBottomColor: PALETTE.lightSlate, // #CBD5E1
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
  appBranding: {
    fontSize: 20,
    fontWeight: '800',
    color: PALETTE.darkNavy, // #24303E Dark Navy
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 11,
    color: PALETTE.slateBlue, // #64748B Slate Blue
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  adminIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.darkNavy,
  },
  avatarPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PALETTE.darkNavy,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  avatarPillText: {
    color: PALETTE.offWhite,
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  authBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  authBannerText: {
    fontSize: 12,
    color: PALETTE.slateBlue,
    flex: 1,
  },
  authButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authMiniButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  authMiniButtonFilled: {
    backgroundColor: PALETTE.darkNavy,
    borderColor: PALETTE.darkNavy,
  },
  authMiniButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.darkNavy,
  },
  authMiniButtonTextWhite: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.offWhite,
  },
  periodSection: {
    marginTop: SPACING.sm,
  },
  periodHeaderLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.slateBlue,
    marginLeft: SPACING.xl,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: PALETTE.lightSlate,
    alignSelf: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: PALETTE.slateBlue,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.deepBlack,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: 4,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  actionCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: PALETTE.lightSlate,
  },
  actionCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.deepBlack,
  },
  actionCardTextWhite: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.offWhite,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: PALETTE.deepBlack,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.darkNavy,
  },
  adminNote: {
    fontSize: 12,
    color: PALETTE.slateBlue,
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: PALETTE.slateBlue,
    fontSize: 14,
  },
});
