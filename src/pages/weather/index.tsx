import { PX } from '@/config';
import connect, { dispatch } from '@/models';
import { WeatherState } from '@/models/weather';
import { PageContainer } from '@/components/Animation';
import { FCN } from '@/utils/types';
import React, { FC, useRef, useState } from 'react';
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

interface WeatherProps {
  loading: boolean;
  weather: WeatherState;
}

const Weather: FCN<WeatherProps> = ({ loading, weather: { cities } }) => {
  const pageIndex = useRef(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const onRefresh = () => dispatch.weather.fetchWeather(cities[pageIndex.current].id);
  return (
    <PageContainer onRefresh={onRefresh} refreshing={loading} style={{ flex: 1 }}>
      <StatusBar animated barStyle="dark-content" backgroundColor="#fff" />
      <Swiper scrollEnabled={scrollEnabled} width={PX.VW(100)}>
        {cities.map(city => (
          <City city={city} key={city.id} />
        ))}
      </Swiper>
    </PageContainer>
  );
};

Weather.navigationOptions = {
  header: null,
};

export default connect(({ weather, $loading: { weather: { model: loading } } }) => ({
  weather,
  loading,
}))<WeatherState>(Weather);
