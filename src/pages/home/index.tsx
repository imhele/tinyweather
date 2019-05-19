import { FCN } from '@/utils/types';
import React from 'react';
import { StatusBar, View } from 'react-native';

const Home: FCN = props => {
  return <View><StatusBar /></View>;
};

Home.navigationOptions = {
  headerBackTitle: null,
};

export default Home;
