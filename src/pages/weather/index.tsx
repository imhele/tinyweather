import { PX } from '@/config';
import connect from '@/models';
import { WeatherState } from '@/models/weather';
import { FCN } from '@/utils/types';
import React, { FC, useState } from 'react';
import { ScrollView, ScrollViewProps, StatusBar, View } from 'react-native';
import City from './city';

interface SwiperProps extends ScrollViewProps {
  width?: number;
}

const Swiper: FC<SwiperProps> = ({ children, width, ...props }) => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      pinchGestureEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...props}
      style={[{ flex: 1, width }, props.style]}
    >
      {children}
    </ScrollView>
  );
};

const Weather: FCN<WeatherState> = ({ cities }) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar animated barStyle="dark-content" backgroundColor="#fff" />
      <Swiper scrollEnabled={scrollEnabled} width={PX.VW(100)}>
        {cities.map(city => (
          <City city={city} key={city.id} />
        ))}
      </Swiper>
    </View>
  );
};

Weather.navigationOptions = {
  header: null,
};

export default connect(({ weather }) => weather)<WeatherState>(Weather);
