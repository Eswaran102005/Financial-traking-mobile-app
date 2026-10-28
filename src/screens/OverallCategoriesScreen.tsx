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
import { useNavigation } from '@react-navigation/native';
import { Menu, ShieldAlert } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { CategoryProgressCard } from '../components/CategoryProgressCard';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const OverallCategoriesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { role, getAllCategorySpendings } = useApp();

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 4,
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
          <ShieldAlert size={48} color={COLORS.warning} />
          <Text style={styles.guardTitle}>Customer Screen Only</Text>
          <Text style={styles.guardDescription}>
            Category budget management is designed specifically for Customer financial planning.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const categorySpendings = getAllCategorySpendings();
  const totalBudget = categorySpendings.reduce((sum, item) => sum + item.category.budget, 0);
  const totalSpent = categorySpendings.reduce((sum, item) => sum + item.totalSpent, 0);

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
            <Text style={styles.headerTitle}>Budget Categories</Text>
            <Text style={styles.headerSubtitle}>9 Expense Disciplines</Text>
          </View>
        </View>

        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{categorySpendings.length} Categories</Text>
        </View>
      </Animated.View>

      {/* Categories List: slide in from right */}
      <Animated.View style={[{ flex: 1 }, getSlideStyle(1, 'right')]}>
        <FlatList
          data={categorySpendings}
          keyExtractor={(item) => item.category.id}
          renderItem={({ item }) => (
            <CategoryProgressCard
              item={item}
              onPress={() =>
                navigation.navigate('CategoryDetails', { categoryId: item.category.id })
              }
            />
          )}
          ListHeaderComponent={
            <View style={styles.summaryBanner}>
              <View style={styles.summaryBannerLeft}>
                <Text style={styles.bannerLabel}>Total Monthly Budgets</Text>
                <Text style={styles.bannerValue}>{formatCurrency(totalBudget)}</Text>
              </View>
              <View style={styles.summaryBannerDivider} />
              <View style={styles.summaryBannerRight}>
                <Text style={styles.bannerLabel}>Allocated Spend</Text>
                <Text style={styles.bannerValue}>{formatCurrency(totalSpent)}</Text>
              </View>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
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
    borderBottomColor: PALETTE.lightSlate, // #CBD5E1 subtle border
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
    color: PALETTE.deepBlack, // #0B0F14
  },
  headerSubtitle: {
    fontSize: 11,
    color: PALETTE.slateBlue, // #64748B
  },
  countPill: {
    backgroundColor: PALETTE.darkNavy, // #24303E
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.offWhite, // #F8FAFC
  },
  summaryBanner: {
    flexDirection: 'row',
    backgroundColor: PALETTE.darkNavy, // #24303E highlighted financial summary
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate, // #CBD5E1 subtle border
    ...SHADOWS.cardDark,
  },
  summaryBannerLeft: {
    flex: 1,
  },
  summaryBannerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  summaryBannerDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(203, 213, 225, 0.3)', // subtle light slate divider
    alignSelf: 'center',
  },
  bannerLabel: {
    fontSize: 11,
    color: PALETTE.lightSlate, // #CBD5E1 secondary text on dark
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  bannerValue: {
    fontSize: 18,
    fontWeight: '800',
    color: PALETTE.offWhite, // #F8FAFC primary text on dark
  },
  listContent: {
    paddingBottom: 110,
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
