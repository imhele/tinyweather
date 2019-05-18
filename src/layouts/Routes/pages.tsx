import Wrapper from '@/components/Wrapper';
import intl, { getLocale } from '@/components/intl';
import HomePage from '@/pages/home';
import MinePage from '@/pages/mine';
import { AnyComponent, FCN } from '@/utils/types';
import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  NavigationScreenConfig,
  NavigationScreenOptions,
} from 'react-navigation';

const CommonPages: { [K: string]: AnyComponent } = {};
const initialRouteParams = {
  locale: getLocale(),
};
const [home, mine] = [HomePage, MinePage].map((Page: FCN) => {
  const Wrapped: FCN = ({ children, ...props }) => (
    <Wrapper {...props}>
      <Page>{children}</Page>
    </Wrapper>
  );
  Wrapped.navigationOptions = Page.navigationOptions;
  return Wrapped;
});

/**
 ** ****************************
 ** `Home` tab - stack navigator
 ** ****************************
 */
const hometabConfig: NavigationScreenConfig<NavigationScreenOptions> = ({ navigationOptions }) => ({
  title: intl.upper('挑食'),
  ...navigationOptions,
});

const hometab = createStackNavigator(
  {
    ...CommonPages,
    home,
  },
  {
    initialRouteKey: 'home',
    initialRouteName: 'home',
    initialRouteParams,
  },
);

hometab.navigationOptions = hometabConfig;

/**
 ** ****************************
 ** `User` tab - stack navigator
 ** ****************************
 */
const usertabConfig: NavigationScreenConfig<NavigationScreenOptions> = ({ navigationOptions }) => ({
  title: intl.upper('我的'),
  ...navigationOptions,
});

const usertab = createStackNavigator(
  {
    ...CommonPages,
    mine,
  },
  {
    initialRouteKey: 'mine',
    initialRouteName: 'mine',
    initialRouteParams,
  },
);

usertab.navigationOptions = usertabConfig;

/**
 ** **********************
 ** `Roor` - tab navigator
 ** **********************
 */
const Root = createBottomTabNavigator(
  {
    hometab,
    usertab,
  },
  {
    initialRouteName: 'hometab',
    defaultNavigationOptions: {},
    order: ['hometab', 'usertab'],
    tabBarOptions: {
      activeTintColor: '#fa8c16',
      inactiveTintColor: '#9d9d9d',
      showIcon: true,
      showLabel: true,
    },
  },
);

export default Root;
