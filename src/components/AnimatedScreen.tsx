import React, { createContext, useContext } from 'react';
import {
  Animated,
  ViewStyle,
  StyleProp,
  StyleSheet,
  ViewProps,
} from 'react-native';
import {
  useScreenEntryAnimation,
  UseScreenEntryAnimationOptions,
  SlideDirection,
  SlideStyleResult,
} from '../hooks/useScreenEntryAnimation';

interface ScreenAnimationContextValue {
  getEntryStyle: (
    index?: number,
    directionOrDistance?: SlideDirection | number,
    explicitDirection?: SlideDirection
  ) => SlideStyleResult;
  getSlideStyle: (
    index?: number,
    direction?: SlideDirection,
    customDistance?: number
  ) => SlideStyleResult;
}

const ScreenAnimationContext = createContext<ScreenAnimationContextValue | null>(null);

export interface AnimatedScreenProps extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  animationOptions?: UseScreenEntryAnimationOptions;
  /**
   * If true, also animates the top-level container directly (default: true)
   */
  animateContainer?: boolean;
}

/**
 * AnimatedScreen wraps a screen and provides repeatable entry animations
 * on every focus/visit event.
 */
export const AnimatedScreen: React.FC<AnimatedScreenProps> = ({
  children,
  style,
  animationOptions,
  animateContainer = true,
  ...props
}) => {
  const { getEntryStyle, getSlideStyle } = useScreenEntryAnimation(animationOptions);

  return (
    <ScreenAnimationContext.Provider value={{ getEntryStyle, getSlideStyle }}>
      <Animated.View
        style={[
          styles.container,
          style,
          animateContainer ? getSlideStyle(0, 'left') : undefined,
        ]}
        {...props}
      >
        {children}
      </Animated.View>
    </ScreenAnimationContext.Provider>
  );
};

export interface AnimatedItemProps extends ViewProps {
  children: React.ReactNode;
  index?: number;
  direction?: SlideDirection;
  offsetDistance?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * AnimatedCard / AnimatedSection: A staggered child component inside an AnimatedScreen
 */
export const AnimatedCard: React.FC<AnimatedItemProps> = ({
  children,
  index = 1,
  direction,
  offsetDistance,
  style,
  ...props
}) => {
  const context = useContext(ScreenAnimationContext);
  const animStyle = context
    ? context.getSlideStyle(index, direction, offsetDistance)
    : undefined;

  return (
    <Animated.View style={[style, animStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

export const AnimatedSection = AnimatedCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
