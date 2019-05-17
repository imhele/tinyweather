import Wrapper from '@/components/Wrapper';
import { AnyComponent } from '@/utils/types';
import HomePage from '@/pages/home';
import MinePage from '@/pages/mine';
import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  NavigationTabScreenOptions,
} from 'react-navigation';

const CommonPages: { [K: string]: AnyComponent } = {};
const [home, mine] = [HomePage, MinePage].map(
  (Page): React.FC => ({ children, ...props }) => (
    <Wrapper {...props}>
      <Page>{children}</Page>
    </Wrapper>
  ),
);

const hometab = createStackNavigator(
  {
    ...CommonPages,
    home,
  },
  {
    initialRouteName: 'home',
  },
);

hometab.navigationOptions = {
  title: '挑食',
} as NavigationTabScreenOptions;

const usertab = createStackNavigator(
  {
    ...CommonPages,
    mine,
  },
  {
    initialRouteName: 'mine',
  },
);

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
