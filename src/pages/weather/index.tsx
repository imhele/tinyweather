import { PX } from '@/config';
import connect, { dispatch } from '@/models';
import { WeatherState } from '@/models/weather';
import { PageContainer } from '@/components/Animation';
import { FCN } from '@/utils/types';
import React, { FC, LegacyRef, useRef, useState } from 'react';
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
  scrollRef?: LegacyRef<ScrollView>;
  width?: number;
}

const Swiper: FC<SwiperProps> = ({ children, onChangePage, scrollRef, width, ...props }) => {
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
      ref={scrollRef}
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
  const scolling = useRef(false);
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef(null as ScrollView | null);
  const [collapsed, setCollapsed] = useState(false);
  const onRefresh = async () => {
    if (loading) return;
    setLoading(true);
    await dispatch.weather.fetchWeather(pageIndex.current);
    setLoading(false);
  };
  const onChangePage = (index: number) => {
    pageIndex.current = index;
    if (!weatherData[pageIndex.current]) onRefresh();
  };
  const onClickCity = () => {
    if (!pageIndex.current) return setCollapsed(true);
    if (!swiperRef.current) return;
    scolling.current = true;
    swiperRef.current.scrollTo({ x: 0, y: 0 });
    setCollapsed(true);
  };

  useState(() => {
    onChangePage(0);
  });

  return (
    <PageContainer onRefresh={onRefresh} refreshing={loading} style={{ flex: 1 }}>
      <StatusBar animated barStyle="dark-content" backgroundColor="#fff" />
      <Swiper
        onChangePage={onChangePage}
        scrollEnabled={!collapsed}
        scrollRef={instance => (swiperRef.current = instance)}
        width={PX.VW(100)}
      >
        {cities.map((city, index) => (
          <City
            city={city}
            key={city.id}
            index={index}
            collapsed={collapsed}
            onClickCity={onClickCity}
            weather={weatherData[index]}
          />
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
