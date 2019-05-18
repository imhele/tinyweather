import React from 'react';
import { NavigationScreenConfig, NavigationScreenOptions } from 'react-navigation';

export type AnyComponent = React.Component | React.FunctionComponent;

export type AnyComponentClass = React.ComponentClass | React.FunctionComponent;

export type NavigationOptions = NavigationScreenConfig<NavigationScreenOptions>;

export type FunctionComponentNavigator<P = {}> = React.FunctionComponent<P> & {
  navigationOptions?: NavigationOptions;
};

export type FCN<P = {}> = FunctionComponentNavigator<P>;
