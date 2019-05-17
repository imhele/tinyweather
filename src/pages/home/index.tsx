import React, { FC } from 'react';
import { Text } from 'react-native';
import intl from '@/components/intl';

const Home: FC = props => {
  return <Text>{intl('挑食')}</Text>;
};

export default Home;
