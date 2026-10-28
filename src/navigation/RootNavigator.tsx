import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { DrawerNavigator } from './DrawerNavigator';
import { LaunchScreen } from '../screens/LaunchScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { CategoryDetailsScreen } from '../screens/CategoryDetailsScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { PALETTE } from '../constants/theme';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Launch"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: PALETTE.deepBlack }, // #0B0F14 ensures zero white-flicker
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Smooth horizontal slide transition
        gestureEnabled: true,
      }}
    >
      {/* 1. Launch Animation Screen */}
      <Stack.Screen
        name="Launch"
        component={LaunchScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />

      {/* 2. Authentication Flow */}
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          presentation: 'card',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          presentation: 'card',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      {/* 3. Protected Dashboard Container (Accessed only after login) */}
      <Stack.Screen
        name="MainDrawer"
        component={DrawerNavigator}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />

      {/* 4. Action & Detail Screens */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          presentation: 'card',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetailsScreen}
        options={{
          presentation: 'card',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Smooth slide-up modal transition
        }}
      />
    </Stack.Navigator>
  );
};
