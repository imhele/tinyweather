import React, { FC, useState } from 'react';
import { Animated, EasingFunction, TouchableWithoutFeedback, ViewProps } from 'react-native';

export interface HoverScaleProps extends ViewProps {
  delay?: [number, number];
  duration?: [number, number];
  easing?: [EasingFunction, EasingFunction] | [EasingFunction] | never[];
  onHover?: () => void;
  onUnHover?: () => void;
  scale?: [number, number];
  useNativeDriver?: boolean;
}

const createAnimation = ({
  delay = [0, 0],
  duration = [160, 160],
  easing = [],
  scale: value = [1, 0.9],
  onHover = () => {},
  onUnHover = () => {},
  useNativeDriver = true,
}: HoverScaleProps): [Animated.Value, () => void, () => void] => {
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
    () => {
      reAni.stop();
      ani.start();
      onHover();
    },
    () => {
      ani.stop();
      reAni.start();
      onUnHover();
    },
  ];
};

const HoverScale: FC<HoverScaleProps> = ({ children, ...props }) => {
  const [scale, onPressIn, onPressOut] = useState(() => createAnimation(props))[0];
  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View {...props} style={[props.style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default HoverScale;