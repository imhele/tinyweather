import React from 'react';
import { TabBarIconProps } from 'react-navigation';
import Icon, { IconProps } from './index';

const TabBarIcon = (props: IconProps) => ({ focused, tintColor: color }: TabBarIconProps) => (
  <Icon
    {...props}
    key={props.type}
    style={
      focused && color
        ? {
            fontSize: 28,
            ...props.style,
            color,
          }
        : {
            fontSize: 28,
            ...props.style,
          }
    }
  />
);

export default TabBarIcon;
