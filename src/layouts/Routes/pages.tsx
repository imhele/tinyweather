import Wrapper from '@/components/Wrapper';
import intl, { getLocale } from '@/components/intl';
import { AnyComponent } from '@/utils/types';
import HomePage from '@/pages/home';
import MinePage from '@/pages/mine';
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
const [home, mine] = [HomePage, MinePage].map(
  (Page): React.FC => ({ children, ...props }) => (
    <Wrapper {...props}>
      <Page>{children}</Page>
    </Wrapper>
  ),
);

/**
 ** ****************************
 ** `Home` tab - stack navigator
 ** ****************************
 */
const hometabConfig: NavigationScreenConfig<NavigationScreenOptions> = () => ({
  title: intl.upper('挑食'),
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
const usertabConfig: NavigationScreenConfig<NavigationScreenOptions> = () => ({
  title: intl.upper('我的'),
});

const usertab = createStackNavigator(
  {
    ...CommonPages,
    mine,
  },
  {
    initialRouteKey: 'mine',
    initialRouteName: 'mine',
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
