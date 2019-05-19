import { Color } from '@/config';
import { FCN } from '@/utils/types';
import React from 'react';
import { StatusBar, View } from 'react-native';
import Banner from './Banner'
import Header from './Header';

const Home: FCN = props => {
  const paddingHorizontal = 16;
  return (
    <View>
      <StatusBar animated barStyle="light-content" backgroundColor={Color.Primary} />
      <Banner />
    </View>
  );
};

Home.navigationOptions = ({ navigation }) => ({
  header: <Header navigation={navigation} />,
  headerBackTitle: null,
});

export default Home;
