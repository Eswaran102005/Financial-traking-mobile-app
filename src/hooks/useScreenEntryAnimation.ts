import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, AccessibilityInfo } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export type SlideDirection = 'left' | 'right';

export interface UseScreenEntryAnimationOptions {
  /**
   * Number of staggered animated values to generate (default: 14)
   */
  staggerCount?: number;
  /**
   * Duration of each animation in milliseconds (default: 380, recommended: 350-450ms)
   */
  duration?: number;
  /**
   * Stagger delay between successive items in milliseconds (default: 70, recommended: 60-90ms)
   */
  staggerDelay?: number;
  /**
   * Horizontal offset distance in dp (default: 38, recommended: 30-45dp)
   */
  offsetDistance?: number;
  /**
   * Initial opacity at start of animation (default: 0.8, recommended: 0.7-0.85)
   */
  initialOpacity?: number;
  /**
   * Default starting direction for index 0 (default: 'left')
   */
  startDirection?: SlideDirection;
}

export interface SlideStyleResult {
  opacity: Animated.AnimatedInterpolation<number>;
  transform: {
    translateX: Animated.AnimatedInterpolation<number>;
  }[];
}

/**
 * Hook providing smooth, non-flickering side-slide entrance animations
 * that replay reliably on every screen visit (via useFocusEffect).
 *
 * Left-side entrance: starts at -offsetDistance and slides to 0.
 * Right-side entrance: starts at +offsetDistance and slides to 0.
 * Initial opacity: 0.8 (prevents screen blanking / black flicker) -> 1.0.
 * Timing: 380ms per component, 70ms stagger, Easing.out(Easing.cubic).
 */
export function useScreenEntryAnimation(options: UseScreenEntryAnimationOptions = {}) {
  const {
    staggerCount = 14,
    duration = 380,
    staggerDelay = 70,
    offsetDistance = 38,
    initialOpacity = 0.8,
    startDirection = 'left',
  } = options;

  const [reduceMotion, setReduceMotion] = useState(false);

  // Check accessibility reduced-motion preference
  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) {
          setReduceMotion(enabled);
        }
      })
      .catch(() => {});

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotion(enabled);
      }
    );

    return () => {
      isMounted = false;
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  // Stable animated values (0 = initial offset & initialOpacity, 1 = resting position & full opacity)
  // Preserved across renders to avoid re-creation flickering
  const animValues = useRef(
    Array.from({ length: staggerCount }, () => new Animated.Value(0))
  ).current;

  // Active composite animation reference for clean cancellation
  const activeAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  useFocusEffect(
    useCallback(() => {
      // 1. Cancel any active animation cleanly
      if (activeAnimRef.current) {
        activeAnimRef.current.stop();
        activeAnimRef.current = null;
      }

      // If user enabled reduced-motion, settle immediately at final resting position
      if (reduceMotion) {
        animValues.forEach((val) => val.setValue(1));
        return;
      }

      // 2. Reset progress to 0 to prepare for the smooth slide entrance
      animValues.forEach((val) => val.setValue(0));

      // 3. Build native-driver timing animations with smooth cubic ease-out
      const animations = animValues.map((val) =>
        Animated.timing(val, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      );

      // 4. Stagger major component entrances
      const composite =
        staggerDelay > 0
          ? Animated.stagger(staggerDelay, animations)
          : Animated.parallel(animations);

      activeAnimRef.current = composite;
      composite.start((result) => {
        if (result.finished) {
          activeAnimRef.current = null;
        }
      });

      return () => {
        // When losing focus, stop active animation and settle all values at 1
        // so content remains fully visible without any flash or disappearing effect
        if (activeAnimRef.current) {
          activeAnimRef.current.stop();
          activeAnimRef.current = null;
        }
        animValues.forEach((val) => val.setValue(1));
      };
    }, [animValues, duration, staggerDelay, reduceMotion])
  );

  /**
   * Helper to return animated style (opacity + translateX) with explicit or alternating direction.
   *
   * @param index Stagger index (0, 1, 2, ...)
   * @param direction Optional explicit 'left' | 'right'. If omitted, automatically alternates.
   * @param customDistance Optional custom horizontal offset distance in dp.
   */
  const getSlideStyle = (
    index: number = 0,
    direction?: SlideDirection,
    customDistance?: number
  ): SlideStyleResult => {
    // Determine alternating direction if not explicitly supplied
    const defaultDir: SlideDirection =
      startDirection === 'left'
        ? index % 2 === 0
          ? 'left'
          : 'right'
        : index % 2 === 0
        ? 'right'
        : 'left';

    const dir: SlideDirection = direction || defaultDir;
    const distance = reduceMotion
      ? 0
      : customDistance !== undefined
      ? customDistance
      : offsetDistance;

    const startX = dir === 'left' ? -distance : distance;
    const clampedIndex = Math.min(Math.max(index, 0), animValues.length - 1);
    const anim = animValues[clampedIndex];

    return {
      opacity: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [reduceMotion ? 1 : initialOpacity, 1],
      }),
      transform: [
        {
          translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [startX, 0],
          }),
        },
      ],
    };
  };

  /**
   * Backwards-compatible alias for getSlideStyle:
   * Supports:
   *   getEntryStyle(index) -> alternates direction
   *   getEntryStyle(index, 'left') -> explicit direction
   *   getEntryStyle(index, 40) -> custom distance with alternating direction
   *   getEntryStyle(index, 40, 'right') -> custom distance + explicit direction
   */
  const getEntryStyle = (
    index: number = 0,
    directionOrDistance?: SlideDirection | number,
    explicitDirection?: SlideDirection
  ): SlideStyleResult => {
    if (typeof directionOrDistance === 'string') {
      return getSlideStyle(index, directionOrDistance);
    }
    if (typeof directionOrDistance === 'number') {
      return getSlideStyle(index, explicitDirection, directionOrDistance);
    }
    return getSlideStyle(index);
  };

  return {
    getSlideStyle,
    getEntryStyle,
    animValues,
    reduceMotion,
  };
}
