import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';

export const AlertBanner: React.FC = () => {
  const { activeAlert, dismissAlert } = useApp();
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (activeAlert) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      slideAnim.setValue(-100);
    }
  }, [activeAlert]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      dismissAlert();
    });
  };

  if (!activeAlert) return null;

  const getAlertStyles = () => {
    switch (activeAlert.type) {
      case 'warning':
        return {
          icon: <AlertTriangle size={20} color="#FBBF24" />,
        };
      case 'error':
        return {
          icon: <AlertCircle size={20} color="#F87171" />,
        };
      case 'info':
        return {
          icon: <Info size={20} color={PALETTE.lightSlate} />,
        };
      case 'success':
      default:
        return {
          icon: <CheckCircle2 size={20} color="#34D399" />,
        };
    }
  };

  const styleConfig = getAlertStyles();

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          top: insets.top + SPACING.sm,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>{styleConfig.icon}</View>
        <View style={styles.textContainer}>
          {activeAlert.title ? (
            <Text style={styles.title}>{activeAlert.title}</Text>
          ) : null}
          <Text style={styles.message}>{activeAlert.message}</Text>
        </View>
        <Pressable
          onPress={handleDismiss}
          hitSlop={8}
          style={styles.closeButton}
          accessibilityLabel="Dismiss alert"
        >
          <X size={16} color={PALETTE.lightSlate} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 50,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 9999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate, // #CBD5E1 subtle border
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy
    ...SHADOWS.md,
  },
  iconContainer: {
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.offWhite, // #F8FAFC on dark
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    fontWeight: '500',
    color: PALETTE.offWhite, // #F8FAFC on dark
    lineHeight: 18,
  },
  closeButton: {
    padding: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
