import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import map from '@/assets/icon/map';

export interface IconProps extends TextProps {
  children?: never;
  style?: TextStyle;
  type: keyof typeof map;
}

const Icon: React.FC<IconProps> = ({ children, style, type, ...props }) => (
  <Text {...props} style={{ fontFamily: 'iconfont', ...style }}>
    {map[type]}
  </Text>
);

export default Icon;
