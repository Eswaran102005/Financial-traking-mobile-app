import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import {
  Home,
  BarChart3,
  Receipt,
  Grid,
  User as UserIcon,
  LogOut,
  RefreshCw,
  Shield,
  Repeat,
  LogIn,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation,
  state,
}) => {
  const { user, role, logout, switchDemoRole, resetDemoData } = useApp();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of your session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          navigation.closeDrawer();
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' as any }],
          });
        },
      },
    ]);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Demo Data',
      'This will restore all default transactions, demo accounts, and categories. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            navigation.closeDrawer();
            await resetDemoData();
          },
        },
      ]
    );
  };

  // Helper to navigate to a tab and automatically hide the side navbar
  const navigateToTab = (tabName: string) => {
    navigation.navigate('TabNavigator', { screen: tabName });
    navigation.closeDrawer();
  };

  const handleSwitchRole = (targetRole: UserRole) => {
    navigation.closeDrawer();
    switchDemoRole(targetRole);
  };

  const navigateToAuth = (screen: 'SignIn' | 'SignUp') => {
    navigation.closeDrawer();
    navigation.navigate(screen);
  };

  // Accurately determine the currently active tab inside TabNavigator
  const tabState = state.routes[state.index]?.state;
  const currentTab = tabState?.routes ? tabState.routes[tabState.index || 0]?.name : 'HomeTab';

  return (
    <View style={styles.container}>
      {/* Drawer User Header in Dark Navy */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'FT'}
          </Text>
        </View>

        <Text style={styles.userName} numberOfLines={1}>
          {user?.name || 'FinTrack User'}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {user?.email || 'user@budget.com'}
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            {role === 'admin' ? (
              <Shield size={12} color={PALETTE.lightSlate} />
            ) : (
              <UserIcon size={12} color={PALETTE.lightSlate} />
            )}
            <Text style={styles.roleBadgeText}>
              {role === 'admin' ? 'Admin Access' : 'Customer Account'}
            </Text>
          </View>
        </View>

        {/* Quick Demo Role Switcher */}
        <Pressable
          onPress={() => handleSwitchRole(role === 'admin' ? 'customer' : 'admin')}
          style={styles.roleSwitchButton}
        >
          <Repeat size={13} color={PALETTE.offWhite} />
          <Text style={styles.roleSwitchText}>
            Switch to {role === 'admin' ? 'Customer' : 'Admin'} Mode
          </Text>
        </Pressable>
      </View>

      {/* Nav Items */}
      <ScrollView style={styles.navItemsList} contentContainerStyle={styles.navItemsContent}>
        {/* Home */}
        <Pressable
          onPress={() => navigateToTab('HomeTab')}
          style={[styles.menuItem, currentTab === 'HomeTab' && styles.menuItemActive]}
        >
          <Home
            size={20}
            color={currentTab === 'HomeTab' ? PALETTE.offWhite : PALETTE.slateBlue}
          />
          <Text
            style={[styles.menuText, currentTab === 'HomeTab' && styles.menuTextActive]}
          >
            Home Dashboard
          </Text>
        </Pressable>

        {/* Analysis */}
        <Pressable
          onPress={() => navigateToTab('AnalysisTab')}
          style={[styles.menuItem, currentTab === 'AnalysisTab' && styles.menuItemActive]}
        >
          <BarChart3
            size={20}
            color={currentTab === 'AnalysisTab' ? PALETTE.offWhite : PALETTE.slateBlue}
          />
          <Text
            style={[styles.menuText, currentTab === 'AnalysisTab' && styles.menuTextActive]}
          >
            Financial Analysis
          </Text>
        </Pressable>

        {/* Customer Only Screens */}
        {role === 'customer' && (
          <>
            <Pressable
              onPress={() => navigateToTab('TransactionsTab')}
              style={[
                styles.menuItem,
                currentTab === 'TransactionsTab' && styles.menuItemActive,
              ]}
            >
              <Receipt
                size={20}
                color={
                  currentTab === 'TransactionsTab'
                    ? PALETTE.offWhite
                    : PALETTE.slateBlue
                }
              />
              <Text
                style={[
                  styles.menuText,
                  currentTab === 'TransactionsTab' && styles.menuTextActive,
                ]}
              >
                Transactions
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigateToTab('CategoriesTab')}
              style={[
                styles.menuItem,
                currentTab === 'CategoriesTab' && styles.menuItemActive,
              ]}
            >
              <Grid
                size={20}
                color={
                  currentTab === 'CategoriesTab' ? PALETTE.offWhite : PALETTE.slateBlue
                }
              />
              <Text
                style={[
                  styles.menuText,
                  currentTab === 'CategoriesTab' && styles.menuTextActive,
                ]}
              >
                Categories
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigateToTab('ProfileTab')}
              style={[
                styles.menuItem,
                currentTab === 'ProfileTab' && styles.menuItemActive,
              ]}
            >
              <UserIcon
                size={20}
                color={
                  currentTab === 'ProfileTab' ? PALETTE.offWhite : PALETTE.slateBlue
                }
              />
              <Text
                style={[
                  styles.menuText,
                  currentTab === 'ProfileTab' && styles.menuTextActive,
                ]}
              >
                My Profile
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Pressable onPress={() => navigateToAuth('SignIn')} style={styles.footerButton}>
          <LogIn size={17} color={PALETTE.slateBlue} />
          <Text style={styles.footerButtonText}>Switch Account / Sign In</Text>
        </Pressable>

        <Pressable onPress={handleResetData} style={styles.footerButton}>
          <RefreshCw size={17} color={PALETTE.slateBlue} />
          <Text style={styles.footerButtonText}>Reset Demo Data</Text>
        </Pressable>

        <Pressable onPress={handleLogout} style={[styles.footerButton, styles.logoutButton]}>
          <LogOut size={17} color="#DC2626" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.deepBlack, // #0B0F14
  },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: PALETTE.deepBlack, // #0B0F14
    borderWidth: 1.5,
    borderColor: PALETTE.lightSlate, // #CBD5E1
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    color: PALETTE.offWhite,
    fontSize: 20,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.offWhite, // #F8FAFC on dark
  },
  userEmail: {
    fontSize: 13,
    color: PALETTE.lightSlate, // #CBD5E1 on dark
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(11, 15, 20, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.25)',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.lightSlate,
  },
  roleSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.md,
    backgroundColor: 'rgba(11, 15, 20, 0.50)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.30)',
    alignSelf: 'flex-start',
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.offWhite,
  },
  navItemsList: {
    flex: 1,
  },
  navItemsContent: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    marginVertical: 2,
  },
  menuItemActive: {
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy active
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: PALETTE.slateBlue, // #64748B Inactive
  },
  menuTextActive: {
    color: PALETTE.offWhite, // #F8FAFC Active text
    fontWeight: '700',
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: PALETTE.lightSlate, // #CBD5E1
    gap: 4,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: PALETTE.slateBlue,
  },
  logoutButton: {
    marginTop: 4,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
});
