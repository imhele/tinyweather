import map from '@/assets/icon/map';
import React from 'react';
import { Animated, StyleProp, TextStyle, TextProps } from 'react-native';

export interface IconProps extends TextProps {
  children?: never;
  fontWeight?: TextStyle['fontWeight'];
  style?: StyleProp<TextStyle>;
  type: keyof typeof map;
}

const Icon: React.FC<IconProps> = ({ children, fontWeight = 'normal', style, type, ...props }) => (
  <Animated.Text {...props} style={[{ fontFamily: 'iconfont' }, style, { fontWeight }]}>
    {map[type]}
  </Animated.Text>
);

export default Icon;
