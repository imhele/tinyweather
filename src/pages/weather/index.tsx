import { Color, PX } from '@/config';
import { HoverScale, PageContainer, ScaleView } from '@/components/Animation';
import Icon from '@/components/Icon';
import intl from '@/components/intl';
import connect, { dispatch } from '@/models';
import { WeatherState } from '@/models/weather';
import { useChange } from '@/utils/hooks';
import { FCN } from '@/utils/types';
import Toast from '@ant-design/react-native/es/toast';
import React, { FC, Fragment, LegacyRef, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import City, { styles as cityStyles } from './city';

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

const createAnimate = () => {
  const cityNameOpacity: any = new Animated.Value(1);
  const cnc = [
    Animated.timing(cityNameOpacity, { toValue: 0, useNativeDriver: true }),
    Animated.timing(cityNameOpacity, { toValue: 1, useNativeDriver: true }),
  ];
  return {
    cityName: {
      opacity: cityNameOpacity,
    } as TextStyle,
    come: () => {
      cnc[1].stop();
      cnc[0].start();
    },
    back: () => {
      cnc[0].stop();
      cnc[1].start();
    },
  };
};

const onAddCity = (citiesNum: number) => {
  if (citiesNum > 5) return Toast.info(intl.U('最多城市数量', { num: 6 }));
};

interface WeatherProps {
  // loading: boolean;
  weather: WeatherState;
  wingBlank: number;
}

const Weather: FCN<WeatherProps> = ({ weather: { cities, weatherData }, wingBlank }) => {
  const pageIndex = useRef(0);
  const animate = useState(createAnimate)[0];
  const [editing, setEditing] = useState(false);
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
    if (index >= cities.length) return;
    setCollapsed(false);
    if (!swiperRef.current) return;
    swiperRef.current.scrollTo({ x: PX.Device.Width * index, y: 0 });
  };
  const onClickCity = async () => {
    if (pageIndex.current && swiperRef.current) {
      swiperRef.current.scrollTo({ x: 0, y: 0 });
    }
    setCollapsed(true);
    const haventFetch = cities.map((_, i) => i).filter(i => !weatherData[i]);
    if (!haventFetch.length) return;
    return; // TODO
    setLoading(true);
    await dispatch.weather.batchFetchWeather(haventFetch);
    setLoading(false);
  };

  useState(() => onChangePage(0));

  if (useChange(collapsed)) {
    LayoutAnimation.spring();
    if (collapsed) animate.come();
    else animate.back();
  }

  const hoverOpacity = { activeOpacity: Color.Opacity[1] };
  const topNavBarWrapStl = [
    [cityStyles.buttonWrapper, { left: wingBlank, top: 16 }],
    [cityStyles.buttonWrapper, { right: wingBlank, top: 16 }],
  ];
  const EditTopNavBar = (
    <Fragment>
      <ScaleView style={topNavBarWrapStl[0]} visible={collapsed}>
        <HoverScale
          style={cityStyles.buttonContainer}
          opacity={hoverOpacity}
          onPress={() => setEditing(!editing)}
        >
          <Text style={[cityStyles.buttonText, { color: Color.B0 }]}>
            {intl.U(editing ? '完成' : '编辑')}
          </Text>
        </HoverScale>
      </ScaleView>
      <ScaleView style={topNavBarWrapStl[1]} visible={collapsed && cities.length < 7}>
        <HoverScale
          opacity={hoverOpacity}
          onPress={() => onAddCity(cities.length)}
          style={[cityStyles.buttonContainer, { width: 32, paddingHorizontal: 0 }]}
        >
          <Icon style={[cityStyles.buttonText, { color: Color.B0 }]} type="plus" />
        </HoverScale>
      </ScaleView>
    </Fragment>
  );

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
            cityNameStyle={animate.cityName}
          />
        ))}
      </Swiper>
      {EditTopNavBar}
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
    top: 64,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'transparent',
  } as ViewStyle,
});

Weather.navigationOptions = {
  header: null,
};

export default connect(({ global: { wingBlank }, weather }) => ({
  weather,
  wingBlank,
  // loading: $loading.weather.fetchWeather,
}))<WeatherState>(Weather);
