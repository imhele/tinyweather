import connect from '@/models';
import { WeatherState } from '@/models/weather';
import { FCN } from '@/utils/types';
import Carousel from '@ant-design/react-native/es/carousel';
import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';
import City from './city';

const Weather: FCN<WeatherState> = ({ cities }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar animated barStyle="dark-content" backgroundColor="#fff" />
      <Carousel dots={false} style={{ height: '100%' }}>
        {cities.map(city => (
          <City city={city} key={city.id} />
        ))}
      </Carousel>
    </View>
  );
};

Weather.navigationOptions = {
  header: null,
};

export default connect(({ weather }) => weather)<WeatherState>(Weather);
