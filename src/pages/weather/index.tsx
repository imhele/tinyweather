import { PX } from '@/config';
import connect, { dispatch, StateContext } from '@/models';
import { WeatherState } from '@/models/weather';
import { PageContainer } from '@/components/Animation';
import { FCN } from '@/utils/types';
import React, { FC, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  View,
} from 'react-native';
import City from './city';

interface SwiperProps extends ScrollViewProps {
  onChangePage?: (index: number) => void;
  width?: number;
}

const Swiper: FC<SwiperProps> = ({ children, onChangePage, width, ...props }) => {
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (onChangePage) {
      const { contentOffset, layoutMeasurement } = event.nativeEvent;
      onChangePage(Math.floor(contentOffset.x / layoutMeasurement.width));
    }
    if (props.onScroll) props.onScroll(event);
  };
  return (
    <ScrollView
      horizontal
      pagingEnabled
      pinchGestureEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...props}
      onScroll={onScroll}
      style={[{ flex: 1, width }, props.style]}
    >
      {children}
    </ScrollView>
  );
};

interface WeatherProps {
  // loading: boolean;
  weather: WeatherState;
}

const Weather: FCN<WeatherProps> = ({ weather: { cities, weatherData } }) => {
  const pageIndex = useRef(0);
  const [loading, setLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const onRefresh = async () => {
    setLoading(true);
    await dispatch.weather.fetchWeather(pageIndex.current);
    setLoading(false);
  };

  if (!weatherData[pageIndex.current]) onRefresh();

  return (
    <PageContainer onRefresh={onRefresh} refreshing={loading} style={{ flex: 1 }}>
      <StatusBar animated barStyle="dark-content" backgroundColor="#fff" />
      <Swiper
        onChangePage={index => (pageIndex.current = index)}
        scrollEnabled={scrollEnabled}
        width={PX.VW(100)}
      >
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

export default connect(({ weather, $loading }) => ({
  weather,
  // loading: $loading.weather.fetchWeather,
}))<WeatherState>(Weather);
