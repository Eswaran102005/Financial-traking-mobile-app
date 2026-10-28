import React from 'react';
import { Animated, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { SlideDirection, SlideStyleResult } from '../hooks/useScreenEntryAnimation';

export interface AnimatedSlideInProps extends ViewProps {
  children: React.ReactNode;
  direction?: SlideDirection;
  style?: StyleProp<ViewStyle>;
  animStyle?: SlideStyleResult;
}

/**
 * Reusable component for side-slide entrance animations.
 * Applies GPU-accelerated horizontal translation and smooth opacity transitions.
 */
export const AnimatedSlideIn: React.FC<AnimatedSlideInProps> = ({
  children,
  style,
  animStyle,
  ...props
}) => {
  return (
    <Animated.View style={[style, animStyle]} {...props}>
      {children}
    </Animated.View>
  );
};
