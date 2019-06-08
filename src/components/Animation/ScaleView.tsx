import { useChange } from '@/utils/hooks';
import React, { FC, useState } from 'react';
import { Animated, ViewProps } from 'react-native';

export interface ScaleViewProps extends ViewProps {
  afterHide?: () => void;
  afterShow?: () => void;
  delay?: [number, number];
  opacity?: [number, number];
  scale?: [number, number];
  useNativeDriver?: boolean;
  visible?: boolean;
}

const createAnimation = ({
  afterHide,
  afterShow,
  delay = [0, 0],
  opacity: opacityVal = [0, 1],
  scale: scaleVal = [0, 1],
  useNativeDriver = true,
}: ScaleViewProps) => {
  const scale = new Animated.Value(scaleVal[0]);
  const opacity = new Animated.Value(scaleVal[0]);
  const ani = Animated.parallel([
    Animated.spring(scale, {
      delay: delay[0],
      toValue: scaleVal[1],
      useNativeDriver,
    }),
    Animated.spring(opacity, {
      delay: delay[0],
      toValue: opacityVal[1],
      useNativeDriver,
    }),
  ]);
  const reAni = Animated.parallel([
    Animated.spring(scale, {
      delay: delay[1],
      toValue: scaleVal[0],
      useNativeDriver,
    }),
    Animated.spring(opacity, {
      delay: delay[1],
      toValue: opacityVal[0],
      useNativeDriver,
    }),
  ]);
  return {
    style: {
      opacity,
      transform: [{ scale }],
    },
    show: () => {
      reAni.stop();
      if (!afterShow) return ani.start();
      ani.start(e => e.finished && afterShow());
    },
    hide: () => {
      ani.stop();
      if (!afterHide) return reAni.start();
      reAni.start(e => e.finished && afterHide());
    },
  };
};

const ScaleView: FC<ScaleViewProps> = ({
  afterHide,
  afterShow,
  children,
  delay,
  opacity,
  scale,
  useNativeDriver,
  visible = false,
  ...restProps
}) => {
  const animate = useState(() => {
    const res = createAnimation({ afterHide, afterShow, delay, opacity, scale, useNativeDriver });
    if (visible) res.show();
    return res;
  })[0];
  if (useChange(visible)) {
    if (visible) animate.show();
    else animate.hide();
  }
  return (
    <Animated.View {...restProps} style={[restProps.style, animate.style]}>
      {children}
    </Animated.View>
  );
};

export default ScaleView;
