import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, BarChart3, Receipt, Grid, User as UserIcon } from 'lucide-react-native';
import { PALETTE } from '../constants/theme';

const BAR_HEIGHT = 66;

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get('window').width;
  // Default bar width: window width minus 36dp (left 18 + right 18)
  const [barWidth, setBarWidth] = useState(windowWidth - 36);

  // Animation values
  const animatedIndex = useRef(new Animated.Value(state.index)).current;
  const isMounted = useRef(false);

  // Calculate visible floating space (16-24 dp above bottom safe area / Android nav bar)
  const bottomOffset = Math.max(insets.bottom, 10) + 14;

  const routeCount = state.routes.length || 1;
  // 6dp paddingHorizontal on each side of pillBar = 12dp
  const innerBarWidth = Math.max(barWidth - 12, 100);
  const tabWidth = innerBarWidth / routeCount;
  // Dynamic circle size: mathematically round circle that fits cleanly in the tab slot
  const CIRCLE_SIZE = Math.min(54, Math.max(48, Math.round(tabWidth - 8)));

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    // Smooth gliding spring transition across tabs (no blinking or scaling)
    Animated.spring(animatedIndex, {
      toValue: state.index,
      damping: 22,
      stiffness: 180,
      mass: 0.6,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  const inputRange =
    routeCount > 1 ? state.routes.map((_, i) => i) : [0, 1];
  const outputRange =
    routeCount > 1
      ? state.routes.map(
          (_, i) => 6 + i * tabWidth + (tabWidth - CIRCLE_SIZE) / 2
        )
      : [
          6 + (tabWidth - CIRCLE_SIZE) / 2,
          6 + (tabWidth - CIRCLE_SIZE) / 2,
        ];

  const translateX = animatedIndex.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });

  const getTabIcon = (routeName: string, color: string) => {
    const size = 20;
    const strokeWidth = 2.2;
    switch (routeName) {
      case 'HomeTab':
        return <Home size={size} color={color} strokeWidth={strokeWidth} />;
      case 'AnalysisTab':
        return <BarChart3 size={size} color={color} strokeWidth={strokeWidth} />;
      case 'TransactionsTab':
        return <Receipt size={size} color={color} strokeWidth={strokeWidth} />;
      case 'CategoriesTab':
        return <Grid size={size} color={color} strokeWidth={strokeWidth} />;
      case 'ProfileTab':
        return <UserIcon size={size} color={color} strokeWidth={strokeWidth} />;
      default:
        return <Home size={size} color={color} strokeWidth={strokeWidth} />;
    }
  };

  const getTabLabel = (routeName: string, options: any) => {
    if (options.tabBarLabel !== undefined) {
      return options.tabBarLabel;
    }
    if (options.title !== undefined) {
      return options.title;
    }
    switch (routeName) {
      case 'HomeTab':
        return 'Home';
      case 'AnalysisTab':
        return 'Analysis';
      case 'TransactionsTab':
        return 'History';
      case 'CategoriesTab':
        return 'Categories';
      case 'ProfileTab':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom: bottomOffset,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={styles.pillBar}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          if (width > 0 && Math.abs(width - barWidth) > 1) {
            setBarWidth(width);
          }
        }}
      >
        {/* Animated Smooth Gliding Round Circle Indicator */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.slidingCircle,
            {
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              top: (BAR_HEIGHT - CIRCLE_SIZE) / 2,
              transform: [{ translateX }],
            },
          ]}
        />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = getTabLabel(route.name, options);
          const iconColor = isFocused ? PALETTE.offWhite : PALETTE.slateBlue;
          const textColor = isFocused ? PALETTE.offWhite : PALETTE.slateBlue;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || `${label} Tab`}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View style={styles.tabContent}>
                {getTabIcon(route.name, iconColor)}
                <Text
                  style={[
                    styles.tabLabel,
                    { color: textColor },
                    isFocused && styles.tabLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 18,
    right: 18,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBar: {
    flexDirection: 'row',
    width: '100%',
    height: BAR_HEIGHT,
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy background
    borderRadius: BAR_HEIGHT / 2, // Fully rounded elongated pill ends
    borderWidth: 1.5,
    borderColor: 'rgba(203, 213, 225, 0.22)', // Subtle Light Slate border
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    // Modern floating soft shadow
    elevation: 10,
    shadowColor: PALETTE.deepBlack, // #0B0F14
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  slidingCircle: {
    position: 'absolute',
    left: 0,
    backgroundColor: PALETTE.deepBlack, // #0B0F14 Deep Black circular pod
    borderWidth: 1.5,
    borderColor: 'rgba(203, 213, 225, 0.28)', // Light slate border rim
    // Floating soft shadow
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    zIndex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 4,
    zIndex: 2,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    color: PALETTE.offWhite,
  },
});
