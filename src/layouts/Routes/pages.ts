import { AnyComponent } from '@/utils/types';
import home from '@/pages/home';
import {
  createStackNavigator,
  createBottomTabNavigator,
  NavigationTabScreenOptions,
} from 'react-navigation';

const CommonPages: { [K: string]: AnyComponent } = {};

const hometab = createStackNavigator({
  ...CommonPages,
  home,
});

hometab.navigationOptions = {
  title: '挑食',
} as NavigationTabScreenOptions;

const usertab = createStackNavigator({
  ...CommonPages,
});

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
