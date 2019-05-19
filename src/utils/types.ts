import React from 'react';
import {
  NavigationScreenConfig,
  NavigationScreenOptions,
  NavigationScreenProp,
} from 'react-navigation';

export type AnyComponent = React.Component | React.FunctionComponent;

export type AnyComponentClass<P = {}, S = any> =
  | React.ComponentClass<P, S>
  | React.FunctionComponent<P>;

export type NavigationOptions = NavigationScreenConfig<NavigationScreenOptions>;

export type FunctionComponentNavigator<P = {}, N = {}> = React.FunctionComponent<
  P & { navigation: NavigationScreenProp<any, N> }
> & {
  navigationOptions?: NavigationOptions;
};

export type FCN<P = {}, N = {}> = FunctionComponentNavigator<P, N>;

export type Omit<T, K extends string | number | symbol> = { [P in Exclude<keyof T, K>]: T[P] };

export type PowerPartial<T> = { [K in keyof T]?: T[K] extends object ? PowerPartial<T[K]> : T[K] };
