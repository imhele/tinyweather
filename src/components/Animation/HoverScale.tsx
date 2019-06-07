import React, { FC, useState } from 'react';
import {
  Animated,
  EasingFunction,
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  ViewProps,
  ViewStyle,
} from 'react-native';

export interface HoverScaleProps extends ViewProps {
  delay?: [number, number];
  disabled?: boolean;
  duration?: [number, number];
  easing?: [EasingFunction, EasingFunction] | [EasingFunction] | never[];
  onHover?: (event: GestureResponderEvent) => void;
  onPress?: (event: GestureResponderEvent) => void;
  onUnHover?: (event: GestureResponderEvent) => void;
  opacity?: false | TouchableOpacityProps;
  scale?: [number, number];
  useNativeDriver?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
}

const createAnimation = ({
  delay = [0, 0],
  duration = [160, 160],
  easing = [],
  scale: value = [1, 0.9],
  onHover = () => {},
  onUnHover = () => {},
  useNativeDriver = true,
}: HoverScaleProps): [
  Animated.Value,
  (event: GestureResponderEvent) => void,
  (event: GestureResponderEvent) => void
] => {
  const scale = new Animated.Value(value[0]);
  const ani = Animated.timing(scale, {
    delay: delay[0],
    duration: duration[0],
    easing: easing[0],
    toValue: value[1],
    useNativeDriver,
  });
  const reAni = Animated.timing(scale, {
    delay: delay[1],
    duration: duration[1],
    easing: easing[1],
    toValue: value[0],
    useNativeDriver,
  });
  return [
    scale,
    event => {
      reAni.stop();
      ani.start();
      onHover(event);
    },
    event => {
      ani.stop();
      reAni.start();
      onUnHover(event);
    },
  ];
};

const HoverScale: FC<HoverScaleProps> = ({
  children,
  disabled,
  opacity,
  onPress,
  wrapperStyle,
  ...props
}) => {
  const [scale, onPressIn, onPressOut] = disabled
    ? [undefined, undefined, undefined]
    : useState(() => createAnimation(props))[0];
  children = (
    <Animated.View {...props} style={[props.style, scale && { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
  return opacity ? (
    <TouchableOpacity
      {...opacity}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={wrapperStyle}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={wrapperStyle}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};

export default HoverScale;
