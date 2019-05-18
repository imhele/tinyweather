import intl from '@/components/intl';
import React, { FC } from 'react';
import { Text } from 'react-native';

const Home: FC = props => {
  return <Text>{intl('挑食')}</Text>;
};

export default Home;
