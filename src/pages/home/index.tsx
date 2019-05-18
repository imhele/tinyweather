import intl, { setLocale } from '@/components/intl';
import { FCN } from '@/utils/types';
import React from 'react';
import { Text } from 'react-native';

const Home: FCN = props => {
  return <Text>{intl('挑食')}</Text>;
};

Home.navigationOptions = {
  header: null,
};

export default Home;
