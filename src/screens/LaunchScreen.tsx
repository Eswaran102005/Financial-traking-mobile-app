import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Wallet, TrendingUp, Sparkles, PieChart } from 'lucide-react-native';
import { PALETTE, RADIUS, SPACING } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LaunchScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // Animation values
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.6)).current;

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoRotate = useRef(new Animated.Value(0)).current; // -15 deg to 0 deg

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  const progressAnim = useRef(new Animated.Value(0)).current; // 0 to 1

  const screenOpacity = useRef(new Animated.Value(1)).current; // 1 to 0 on exit

  useEffect(() => {
    let isMounted = true;
    let timer: any = null;

    const runLaunchSequence = (reducedMotion: boolean) => {
      if (!isMounted) return;

      if (reducedMotion) {
        // Fast-path for users with reduced motion preferences
        Animated.timing(screenOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          timer = setTimeout(() => {
            if (isMounted) navigation.replace('SignIn');
          }, 600);
        });
        return;
      }

      // STAGE 1 (0 - 400ms): Background Entrance with Navy Glow
      const stage1 = Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);

      // STAGE 2 (400 - 1100ms): Logo Reveal (Scale, Fade, Subtle Rotation)
      const stage2 = Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);

      // STAGE 3 (900 - 1500ms): Brand Name & Subtitle Entrance
      const stage3 = Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]);

      // STAGE 4 (1500 - 2000ms): Elegant Loading Indicator
      const stage4 = Animated.timing(progressAnim, {
        toValue: 1,
        duration: 550,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false, // width animation
      });

      // STAGE 5 (2000 - 2350ms): Fade Out and Navigate to Sign In
      const stage5 = Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      });

      // Sequence orchestration
      stage1.start();

      timer = setTimeout(() => {
        if (!isMounted) return;
        stage2.start();
      }, 350);

      const timer3 = setTimeout(() => {
        if (!isMounted) return;
        stage3.start();
      }, 850);

      const timer4 = setTimeout(() => {
        if (!isMounted) return;
        stage4.start();
      }, 1450);

      const timer5 = setTimeout(() => {
        if (!isMounted) return;
        stage5.start(() => {
          if (isMounted) {
            navigation.replace('SignIn');
          }
        });
      }, 2050);

      return () => {
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    };

    // Check accessibility settings for reduced motion
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        runLaunchSequence(Boolean(enabled));
      })
      .catch(() => {
        runLaunchSequence(false);
      });

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [navigation]);

  const rotationInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.screen, { opacity: screenOpacity }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>

        {/* STAGE 1: Layered Ambient Navy Glow in Background */}
        <Animated.View
          style={[
            styles.glowContainer,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        >
          <View style={styles.outerGlowCircle} />
          <View style={styles.midGlowCircle} />
          <View style={styles.innerGlowCircle} />
        </Animated.View>

        {/* Center Content Container */}
        <View style={styles.centerContent}>
          {/* STAGE 2: Animated Finance Logo Emblem */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { rotate: rotationInterpolate },
                ],
              },
            ]}
          >
            {/* Subtle Outer Halo Ring */}
            <View style={styles.logoHaloRing} />

            {/* Central Dark Navy Badge */}
            <View style={styles.logoBadge}>
              <View style={styles.iconAccentCluster}>
                <Wallet size={34} color={PALETTE.offWhite} strokeWidth={2.2} />
                <View style={styles.badgeMiniSparkle}>
                  <Sparkles size={16} color={PALETTE.lightSlate} />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* STAGE 3: Brand Name & Subtitle */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            <View style={styles.brandRow}>
              <Text style={styles.appName}>Finance Tracker</Text>
            </View>
            <Animated.Text
              style={[
                styles.appSubtitle,
                { opacity: subtitleOpacity },
              ]}
            >
              Manage your money smarter.
            </Animated.Text>
          </Animated.View>

          {/* STAGE 4: Elegant Animated Loading Progress Line */}
          <View style={styles.loadingContainer}>
            <View style={styles.trackBar}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
          </View>
        </View>

        {/* Footer Security Watermark */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SECURE PERSONAL FINANCE</Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.deepBlack, // #0B0F14 Stage 1 background
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PALETTE.deepBlack,
  },
  // Ambient Navy Glow layers
  glowContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlowCircle: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_WIDTH * 0.95,
    borderRadius: (SCREEN_WIDTH * 0.95) / 2,
    backgroundColor: PALETTE.darkNavy, // #24303E
    opacity: 0.12,
  },
  midGlowCircle: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderRadius: (SCREEN_WIDTH * 0.7) / 2,
    backgroundColor: PALETTE.darkNavy, // #24303E
    opacity: 0.25,
  },
  innerGlowCircle: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.45,
    height: SCREEN_WIDTH * 0.45,
    borderRadius: (SCREEN_WIDTH * 0.45) / 2,
    backgroundColor: PALETTE.darkNavy, // #24303E
    opacity: 0.45,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    zIndex: 2,
  },
  // Logo & Emblem Styling
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  logoHaloRing: {
    position: 'absolute',
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 1.5,
    borderColor: 'rgba(203, 213, 225, 0.25)', // #CBD5E1 subtle ring
    backgroundColor: 'rgba(36, 48, 62, 0.45)', // #24303E
  },
  logoBadge: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: PALETTE.darkNavy, // #24303E
    borderWidth: 2,
    borderColor: PALETTE.lightSlate, // #CBD5E1
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  iconAccentCluster: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeMiniSparkle: {
    position: 'absolute',
    top: -6,
    right: -8,
  },
  // Brand Name Typography
  textContainer: {
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: PALETTE.offWhite, // #F8FAFC
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 14,
    color: PALETTE.slateBlue, // #64748B
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  // Stage 4: Loading Line
  loadingContainer: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  trackBar: {
    width: 140,
    height: 3,
    backgroundColor: 'rgba(100, 116, 139, 0.25)', // Slate Blue track
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: PALETTE.offWhite, // #F8FAFC
    borderRadius: RADIUS.full,
  },
  // Footer
  footer: {
    paddingBottom: SPACING.lg,
    zIndex: 2,
  },
  footerText: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '600',
    color: 'rgba(100, 116, 139, 0.6)', // #64748B muted
  },
});
