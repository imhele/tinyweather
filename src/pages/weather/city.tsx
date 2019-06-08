import { HoverScale } from '@/components/Animation';
import { getLocale } from '@/components/intl';
import { Color, Font, PX } from '@/config';
import connect from '@/models';
import { City as CityModel, Forecast, Weather } from '@/services/weather';
import { mixStyle } from '@/utils';
import { useChange } from '@/utils/hooks';
import React, { FC, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Day from './day';

const CityName: FC<{ city: CityModel }> = ({ city }) => {
  let prefix = city.en;
  let suffix: string | undefined;
  if (getLocale() === 'zh-CN') {
    prefix = city.county;
    if (city.county !== city.city) suffix = city.city;
    else if (city.county !== city.province) suffix = city.province;
  }
  if (suffix)
    return (
      <Text numberOfLines={1}>
        <Text style={styles.cityName}>{`${prefix}  `}</Text>
        <Text style={styles.cityNameSuffix}>{suffix}</Text>
      </Text>
    );
  return (
    <Text numberOfLines={1}>
      <Text style={styles.cityName}>{prefix}</Text>
    </Text>
  );
};

const createAnimate = () => {
  const cityNameColor: any = new Animated.Value(1);
  const cnc = [
    Animated.timing(cityNameColor, { toValue: 1.2, useNativeDriver: true }),
    Animated.timing(cityNameColor, { toValue: 1, useNativeDriver: true }),
  ];
  return {
    cityName: {
      // color: cityNameColor,
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

const defaultForecast: Forecast = {
  conditionDay: '晴',
  conditionIdDay: '0',
  conditionIdNight: '30',
  conditionNight: '晴',
  humidity: '--',
  predictDate: '--',
  tempDay: '--',
  tempNight: '--',
  updatetime: '-- --',
  windDegreesDay: '--',
  windDegreesNight: '--',
  windDirDay: '',
  windDirNight: '',
  windLevelDay: '--',
  windLevelNight: '--',
};

export const getTimeZone = (t?: string) =>
  t && t.search(/\D/) === -1 ? parseInt(t, 10) : undefined;

export interface CityProps {
  city: CityModel;
  collapsed?: boolean;
  index: number;
  onClickCity?: () => void;
  weather?: Partial<Weather>;
  wingBlank: number;
}

const City: FC<CityProps> = ({
  city,
  collapsed = false,
  index: cityIndex,
  onClickCity,
  weather = {},
  wingBlank,
}) => {
  const timezone = getTimeZone(weather.timezone);
  const [activeDay, setActiveDay] = useState(0 as number | true);
  const { forecast = [defaultForecast, defaultForecast, defaultForecast] } = weather;
  const animate = useState(() => createAnimate())[0];
  const containerStyle: ViewStyle = {
    paddingHorizontal: wingBlank,
    top: collapsed ? cityIndex * PX(240) : 0,
    left: collapsed ? cityIndex * PX.VW(-100) : 0,
  };

  if (useChange(collapsed)) {
    LayoutAnimation.spring();
    if (collapsed) animate.come();
    else animate.back();
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {[2, 1, 0].map(index => (
        <Day
          key={index}
          index={index}
          timezone={timezone}
          activeDay={activeDay}
          collapsed={collapsed}
          forecast={forecast[index]}
          onPress={() => collapsed || setActiveDay(index === activeDay || index)}
        />
      ))}
      <HoverScale
        disabled={collapsed}
        onPress={onClickCity}
        style={styles.cityNameContainer}
        opacity={{ activeOpacity: collapsed ? 1 : Color.Opacity[1] }}
        wrapperStyle={mixStyle(
          styles,
          { cityNameWrapper: true, cityNameWrapperCLP: collapsed },
          { left: wingBlank },
          animate.cityName,
        )}
      >
        <CityName city={city} />
      </HoverScale>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: PX.VW(100),
    minHeight: '100%',
    marginTop: 48 + PX(32),
  } as ViewStyle,
  cityNameContainer: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: Color.B6,
  } as ViewStyle,
  cityNameWrapper: {
    height: 32,
    maxWidth: '100%',
    position: 'absolute',
    top: 0 - (32 + 48 + PX(32)) / 2,
  } as ViewStyle,
  cityNameWrapperCLP: {
    top: PX(100) - 16,
    maxWidth: PX.VW(45),
  } as ViewStyle,
  cityName: {
    color: Color.B0,
    fontWeight: '500',
    fontSize: Font.$2.FS,
  } as TextStyle,
  cityNameSuffix: {
    color: Color.B1,
    fontSize: Font.$0.FS,
  } as TextStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<CityProps>(City);
