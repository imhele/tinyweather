import { HoverScale } from '@/components/Animation';
import { getLocale } from '@/components/intl';
import { Color, Font, PX } from '@/config';
import connect from '@/models';
import { City as CityModel, Forecast, Weather } from '@/services/weather';
import React, { FC, useState } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
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
  const containerStyle: ViewStyle = {
    paddingHorizontal: wingBlank,
    top: collapsed ? cityIndex * PX(240) : 0,
    left: collapsed ? cityIndex * PX.VW(-100) : 0,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <HoverScale
        disabled={collapsed}
        onPress={onClickCity}
        style={styles.cityNameContainer}
        opacity={{ activeOpacity: Color.Opacity[1] }}
        wrapperStyle={[styles.cityNameWrapper, { left: wingBlank }]}
      >
        <CityName city={city} />
      </HoverScale>
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
