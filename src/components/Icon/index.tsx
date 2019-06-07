import map from '@/assets/icon/map';
import React from 'react';
import { Animated, StyleProp, TextStyle, TextProps } from 'react-native';

export interface IconProps extends TextProps {
  children?: never;
  style?: StyleProp<TextStyle>;
  type: keyof typeof map;
}

const Icon: React.FC<IconProps> = ({ children, style, type, ...props }) => (
  <Animated.Text {...props} style={[{ fontFamily: 'iconfont' }, style]}>
    {map[type]}
  </Animated.Text>
);

export default Icon;
