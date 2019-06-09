import Wrapper from '@/components/Wrapper';
// import TabBarIcon from '@/components/Icon/TabBarIcon';
import { getLocale } from '@/components/intl';
// import { Color, Font } from '@/config';
// import HomePage from '@/pages/home';
// import MinePage from '@/pages/mine';
import SearchPage from '@/pages/search';
import WeatherPage from '@/pages/weather';
import { AnyComponent, FCN } from '@/utils/types';
import React from 'react';
import {
  createStackNavigator,
  // createBottomTabNavigator,
  // NavigationScreenConfig,
  // NavigationScreenOptions,
} from 'react-navigation';

const CommonPages: { [K: string]: AnyComponent } = {};
const initialRouteParams = {
  locale: getLocale(),
};
const [search, weather] = [SearchPage, WeatherPage].map((Page: FCN<any, any>) => {
  const Wrapped: FCN = ({ children, ...props }) => (
    <Wrapper {...props}>
      <Page {...props}>{children}</Page>
    </Wrapper>
  );
  Wrapped.navigationOptions = Page.navigationOptions;
  return Wrapped;
});

const Root = createStackNavigator(
  {
    ...CommonPages,
    weather,
    search,
  },
  {
    initialRouteKey: 'weather',
    initialRouteName: 'weather',
    initialRouteParams,
  },
);

// /**
//  ** ****************************
//  ** `Home` tab - stack navigator
//  ** ****************************
//  */
// const hometabConfig: NavigationScreenConfig<NavigationScreenOptions> = ({ navigationOptions }) => ({
//   tabBarIcon: TabBarIcon({ type: 'home' }),
//   title: intl.upper('挑食'),
//   ...navigationOptions,
// });

// const hometab = createStackNavigator(
//   {
//     ...CommonPages,
//     home,
//   },
//   {
//     initialRouteKey: 'home',
//     initialRouteName: 'home',
//     initialRouteParams,
//   },
// );

// hometab.navigationOptions = hometabConfig;

// /**
//  ** ****************************
//  ** `User` tab - stack navigator
//  ** ****************************
//  */
// const usertabConfig: NavigationScreenConfig<NavigationScreenOptions> = ({ navigationOptions }) => ({
//   tabBarIcon: TabBarIcon({ type: 'user' }),
//   title: intl.upper('我的'),
//   ...navigationOptions,
// });

// const usertab = createStackNavigator(
//   {
//     ...CommonPages,
//     mine,
//   },
//   {
//     initialRouteKey: 'mine',
//     initialRouteName: 'mine',
//     initialRouteParams,
//   },
// );

// usertab.navigationOptions = usertabConfig;

// /**
//  ** **********************
//  ** `Roor` - tab navigator
//  ** **********************
//  */
// const Root = createBottomTabNavigator(
//   {
//     hometab,
//     usertab,
//   },
//   {
//     initialRouteName: 'hometab',
//     defaultNavigationOptions: {},
//     order: ['hometab', 'usertab'],
//     tabBarOptions: {
//       activeTintColor: Color.TabBar.active,
//       inactiveTintColor: Color.TabBar.inactive,
//       showIcon: true,
//       showLabel: true,
//       labelStyle: {
//         fontSize: Font.$0.FS,
//       },
//       style: {
//         height: 56,
//         borderTopWidth: 1,
//         paddingVertical: 4,
//         borderTopColor: Color.TabBar.border,
//       },
//     },
//   },
// );

export default Root;
