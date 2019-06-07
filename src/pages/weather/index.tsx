import { PX } from '@/config';
import connect, { dispatch } from '@/models';
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
      style={[{ flex: 1, width, minHeight: PX.Device.HeightNS }, props.style]}
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
  const [collapsed, setCollapsed] = useState(false);
  const onRefresh = async () => {
    setLoading(true);
    await dispatch.weather.fetchWeather(pageIndex.current);
    setLoading(false);
  };
  const onChangePage = (index: number) => {
    pageIndex.current = index;
    if (!weatherData[pageIndex.current] && !loading) onRefresh();
  };

  useState(() => {
    onChangePage(0);
  });

  return (
    <PageContainer onRefresh={onRefresh} refreshing={loading} style={{ flex: 1 }}>
      <StatusBar animated barStyle="dark-content" backgroundColor="#fff" />
      <Swiper onChangePage={onChangePage} scrollEnabled={!collapsed} width={PX.VW(100)}>
        {cities.map((city, index) => (
          <City city={city} collapsed={collapsed} key={city.id} weather={weatherData[index]} />
        ))}
      </Swiper>
    </PageContainer>
  );
};

Weather.navigationOptions = {
  header: null,
};

export default connect(({ weather }) => ({
  weather,
  // loading: $loading.weather.fetchWeather,
}))<WeatherState>(Weather);
