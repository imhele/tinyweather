import { Font } from '@/config';
import React from 'react';
import { TabBarIconProps } from 'react-navigation';
import Icon, { IconProps } from './index';

const TabBarIcon = (props: IconProps) => ({ focused, tintColor: color }: TabBarIconProps) => (
  <Icon
    {...props}
    key={props.type}
    style={[
      focused && color
        ? {
            fontSize: Font.$4.FS,
            color,
          }
        : {
            fontSize: Font.$4.FS,
          },
      props.style,
    ]}
  />
);

export default TabBarIcon;
