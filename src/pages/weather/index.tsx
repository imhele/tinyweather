import { Color, PX } from '@/config';
import { HoverScale, PageContainer, ScaleView } from '@/components/Animation';
import Hooks from '@/components/Hooks';
import Icon from '@/components/Icon';
import intl, { getLocale } from '@/components/intl';
import connect, { dispatch, $STATE } from '@/models';
import { City as CityModel, WeatherState } from '@/models/weather';
import { useChange } from '@/utils/hooks';
import { FCN } from '@/utils/types';
import Modal from '@ant-design/react-native/es/modal';
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
import { push } from '@/layouts/Routes';

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
  push('search');
};
const onDltCity = (cities: CityModel[], index: number) => {
  if (cities.length < 2) return Toast.info(intl.U('最少城市数量'));
  const city = cities[index];
  const cityName = getLocale() === 'zh-CN' ? city.county : city.en;
  Modal.alert(intl.U('确认'), intl.U('确认删除城市', { cityName }), [
    { text: intl.U('取消') },
    { text: intl.U('确认'), onPress: () => dispatch.weather.deleteCity(index) },
  ]);
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
  const [collapsed, setCollapsed] = useState(false);
  const swiperRef = useRef(null as ScrollView | null);
  const onClickEdit = () => {
    LayoutAnimation.easeInEaseOut();
    setEditing(!editing);
  };
  const onChangePage = (index: number) => {
    pageIndex.current = index;
    if (cities[pageIndex.current] && !weatherData[pageIndex.current]) onRefresh();
  };
  const onRefresh = async () => {
    if (loading) return;
    setLoading(true);
    if (collapsed) {
      await dispatch.weather.batchFetchWeather(cities.map((_, i) => i));
    } else {
      await dispatch.weather.fetchWeather(pageIndex.current);
    }
    setLoading(false);
  };
  const onOpenCity = (event: GestureResponderEvent) => {
    if (!collapsed || editing) return;
    const { locationY } = event.nativeEvent;
    const index = Math.floor(locationY / 120);
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
    setLoading(true);
    await dispatch.weather.batchFetchWeather(haventFetch);
    setLoading(false);
  };

  useState(() => {
    onChangePage(0);
    Hooks.afterAddCity(() => {
      setLoading(true);
      setEditing(false);
      setCollapsed(false);
      dispatch.weather.fetchWeather(0).then(() => setLoading(false));
    });
  });

  if (useChange(collapsed)) {
    LayoutAnimation.spring();
    if (collapsed) animate.come();
    else animate.back();
  }

  const hoverOpc = { activeOpacity: Color.Opacity[1] };
  const topNavBarWrapStl = [cityStyles.btnWrapper, { top: 16, zIndex: collapsed ? 1 : -1 }];
  const EditTopNavBar = (
    <Fragment>
      <ScaleView style={[topNavBarWrapStl, { left: wingBlank }]} visible={collapsed}>
        <HoverScale onPress={onClickEdit} opacity={hoverOpc} style={cityStyles.btnContainer}>
          <Text style={[cityStyles.btnText, { color: Color.B0 }]}>
            {intl.U(editing ? '完成' : '编辑')}
          </Text>
        </HoverScale>
      </ScaleView>
      <ScaleView
        visible={collapsed && cities.length < 7}
        style={[topNavBarWrapStl, { right: wingBlank }]}
      >
        <HoverScale
          opacity={hoverOpc}
          onPress={() => onAddCity(cities.length)}
          style={[cityStyles.btnContainer, { width: 32, paddingHorizontal: 0 }]}
        >
          <Icon style={[cityStyles.btnText, { color: Color.B0, fontSize: 20 }]} type="plus" />
        </HoverScale>
      </ScaleView>
    </Fragment>
  );

  const swiperMinHeight = Math.max(PX.Device.HeightNS, collapsed ? cities.length * 120 + 64 : 0);
  const dltBtnStl = [cityStyles.btnWrapper, { left: wingBlank, zIndex: editing ? 1 : -1 }];
  const DeleteButton = cities.map((city, i) => (
    <ScaleView key={`${city.id}${i}`} visible={editing} style={[dltBtnStl, { top: i * 120 + 98 }]}>
      <HoverScale
        opacity={hoverOpc}
        style={cityStyles.btnContainer}
        onPress={() => onDltCity(cities, i)}
      >
        <Text style={[cityStyles.btnText, { color: Color.B0 }]}>{intl.U('删除')}</Text>
      </HoverScale>
    </ScaleView>
  ));

  return (
    <PageContainer onRefresh={onRefresh} refreshing={loading} style={{ flex: 1 }}>
      <StatusBar animated barStyle="dark-content" backgroundColor="#fff" />
      <Swiper
        width={PX.VW(100)}
        onChangePage={onChangePage}
        scrollEnabled={!collapsed}
        scrollRef={instance => (swiperRef.current = instance)}
        style={{ minHeight: swiperMinHeight, left: editing ? wingBlank * 2 + 60 : 0 }}
      >
        {cities.map((city, index) => (
          <City
            city={city}
            index={index}
            collapsed={collapsed}
            onClickCity={onClickCity}
            key={`${city.id}${index}`}
            weather={weatherData[index]}
            cityNameStyle={animate.cityName}
          />
        ))}
      </Swiper>
      {EditTopNavBar}
      {DeleteButton}
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
