import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Menu,
  Mail,
  Phone,
  Calendar,
  Wallet,
  Edit3,
  LogOut,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, role, logout, resetDemoData, transactions } = useApp();

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 6,
    duration: 380,
    staggerDelay: 70,
    offsetDistance: 38,
    initialOpacity: 0.8,
  });

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of your session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' as any }],
          });
        },
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert('Reset All Data', 'Reset all transactions and profiles to sample state?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await resetDemoData();
        },
      },
    ]);
  };

  // Role Guard
  if (role !== 'customer') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.guardContainer}>
          <ShieldAlert size={48} color={PALETTE.darkNavy} />
          <Text style={styles.guardTitle}>Customer Screen Only</Text>
          <Text style={styles.guardDescription}>
            You are currently signed in as an Administrator. Customer profile management is
            restricted to Customer accounts.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editHeaderButton}
        >
          <Edit3 size={15} color={PALETTE.darkNavy} />
          <Text style={styles.editHeaderButtonText}>Edit</Text>
        </Pressable>
      </Animated.View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero Card: slide in from right */}
        <Animated.View style={[styles.heroCard, getSlideStyle(1, 'right')]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'CU'}
            </Text>
          </View>

          <Text style={styles.customerName}>{user?.name || 'Alex Morgan'}</Text>
          <Text style={styles.customerRoleTag}>Verified Customer</Text>

          {/* User Stat Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statPillVal}>{transactions.length}</Text>
              <Text style={styles.statPillLabel}>Transactions</Text>
            </View>
            <View style={styles.statPillDivider} />
            <View style={styles.statPill}>
              <Text style={styles.statPillVal}>{formatCurrency(user?.monthlyBudget || 45000)}</Text>
              <Text style={styles.statPillLabel}>Budget Limit</Text>
            </View>
          </View>
        </Animated.View>

        {/* Profile Info Details List: slide in from left */}
        <Animated.View style={[styles.sectionCard, getSlideStyle(2, 'left')]}>
          <Text style={styles.sectionHeading}>Personal Information</Text>

          {/* Email */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Mail size={18} color={PALETTE.darkNavy} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user?.email || 'alex@budget.com'}</Text>
            </View>
          </View>

          {/* Phone */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Phone size={18} color={PALETTE.darkNavy} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user?.phone || '+91 98765 43210'}</Text>
            </View>
          </View>

          {/* Monthly Budget */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Wallet size={18} color={PALETTE.darkNavy} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Monthly Spending Target</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(user?.monthlyBudget || 45000)}
              </Text>
            </View>
          </View>

          {/* Joined Date */}
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View style={styles.infoIconBox}>
              <Calendar size={18} color={PALETTE.darkNavy} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{user?.joinedDate || 'March 2024'}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Primary Action Buttons: slide in from right */}
        <Animated.View style={[styles.actionsContainer, getSlideStyle(3, 'right')]}>
          <Pressable
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.primaryEditButton}
          >
            <Edit3 size={18} color={PALETTE.offWhite} />
            <Text style={styles.primaryEditButtonText}>Edit Profile Details</Text>
          </Pressable>

          <Pressable onPress={handleReset} style={styles.secondaryButton}>
            <RefreshCw size={17} color={PALETTE.slateBlue} />
            <Text style={styles.secondaryButtonText}>Reset Sample Demo Data</Text>
          </Pressable>

          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={17} color="#DC2626" />
            <Text style={styles.logoutButtonText}>Log Out Account</Text>
          </Pressable>
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
    fontSize: 20,
    fontWeight: '800',
    color: PALETTE.deepBlack,
  },
  editHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  editHeaderButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.darkNavy,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 110,
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
    ...SHADOWS.sm,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: PALETTE.offWhite, // #F8FAFC
  },
  customerName: {
    fontSize: 22,
    fontWeight: '800',
    color: PALETTE.deepBlack,
  },
  customerRoleTag: {
    fontSize: 12,
    color: PALETTE.darkNavy,
    fontWeight: '600',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    width: '100%',
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
  },
  statPillDivider: {
    width: 1,
    height: 28,
    backgroundColor: PALETTE.lightSlate,
  },
  statPillVal: {
    fontSize: 16,
    fontWeight: '800',
    color: PALETTE.deepBlack,
  },
  statPillLabel: {
    fontSize: 11,
    color: PALETTE.slateBlue,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.sm,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.slateBlue,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: PALETTE.slateBlue,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: PALETTE.deepBlack,
  },
  actionsContainer: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  primaryEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy primary button
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  primaryEditButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.offWhite, // #F8FAFC
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.slateBlue,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
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
