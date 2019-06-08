import { PX } from '@/config';
import { PageContainer } from '@/components/Animation';
import connect, { dispatch } from '@/models';
import { WeatherState } from '@/models/weather';
import { FCN } from '@/utils/types';
import React, { FC, LegacyRef, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
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
  const onOpenCity = (event: GestureResponderEvent) => {
    if (!collapsed) return;
    const { locationY } = event.nativeEvent;
    const index = Math.floor((locationY - 64) / 120);
    setCollapsed(false);
    if (swiperRef.current) {
      swiperRef.current.scrollTo({ x: PX.Device.Width * index, y: 0 });
    }
  };
  const onClickCity = async () => {
    if (pageIndex.current && swiperRef.current) {
      swiperRef.current.scrollTo({ x: 0, y: 0 });
    }
    setCollapsed(true);
    const haventFetch = cities.map((_, i) => i).filter(i => !weatherData[i]);
    if (!haventFetch.length) return;
    setLoading(true);
    await dispatch.weather.batchFetchWeather(haventFetch);
    setLoading(false);
  };

  useState(() => onChangePage(0));

  return (
    <PageContainer onRefresh={onRefresh} refreshing={loading} style={{ flex: 1 }}>
      <StatusBar animated barStyle="dark-content" backgroundColor="#fff" />
      <Swiper
        width={PX.VW(100)}
        onChangePage={onChangePage}
        scrollEnabled={!collapsed}
        scrollRef={instance => (swiperRef.current = instance)}
        style={{ minHeight: Math.max(PX.Device.HeightNS, cities.length * 120 + 64) }}
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
      {collapsed && (
        <TouchableWithoutFeedback onPress={onOpenCity}>
          <View style={styles.listener} />
        </TouchableWithoutFeedback>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  listener: {
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
  } as ViewStyle,
});

Weather.navigationOptions = {
  header: null,
};

export default connect(({ weather }) => ({
  weather,
  // loading: $loading.weather.fetchWeather,
}))<WeatherState>(Weather);
