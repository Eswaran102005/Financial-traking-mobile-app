import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { MonthWiseTransactionsScreen } from '../screens/MonthWiseTransactionsScreen';
import { OverallCategoriesScreen } from '../screens/OverallCategoriesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { FloatingTabBar } from '../components/FloatingTabBar';
import { useApp } from '../context/AppContext';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  const { role } = useApp();

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="AnalysisTab"
        component={AnalysisScreen}
        options={{
          tabBarLabel: 'Analysis',
        }}
      />

      {/* Customer Tabs */}
      {role === 'customer' && (
        <>
          <Tab.Screen
            name="TransactionsTab"
            component={MonthWiseTransactionsScreen}
            options={{
              tabBarLabel: 'History',
            }}
          />

          <Tab.Screen
            name="CategoriesTab"
            component={OverallCategoriesScreen}
            options={{
              tabBarLabel: 'Categories',
            }}
          />

          <Tab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Profile',
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

