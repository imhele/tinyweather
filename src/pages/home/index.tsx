import { PageContainer } from '@/components/Animation';
import { Color } from '@/config';
import connect, { dispatch } from '@/models';
import { FCN } from '@/utils/types';
import React from 'react';
import { StatusBar } from 'react-native';
import Banner from './Banner';
import Header from './Header';
import ToolBar from './ToolBar';

interface HomeProps {
  refreshing: boolean;
}

const Home: FCN<HomeProps> = ({ refreshing }) => {
  return (
    <PageContainer refreshing={refreshing} onRefresh={dispatch.home.refresh}>
      <StatusBar animated barStyle="light-content" backgroundColor={Color.Primary} />
      <Banner />
      <ToolBar />
    </PageContainer>
  );
};

Home.navigationOptions = ({ navigation }) => ({
  header: <Header navigation={navigation} />,
  headerBackTitle: null,
});

export default connect(({ $loading }) => ({
  refreshing: $loading.home.refresh,
}))<HomeProps>(Home);
