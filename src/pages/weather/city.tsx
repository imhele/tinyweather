import { getLocale } from '@/components/intl';
import { Color, Font, PX } from '@/config';
import connect from '@/models';
import { City as CityModel, Forecast, Weather } from '@/services/weather';
import React, { FC, useState } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Day from './day';

const CityName: FC<{
  city: CityModel;
  style?: StyleProp<TextStyle>;
}> = ({ city, style }) => {
  let prefix = city.en;
  let suffix: string | undefined;
  if (getLocale() === 'zh-CN') {
    prefix = city.county;
    if (city.county !== city.city) suffix = city.city;
    else if (city.county !== city.province) suffix = city.province;
  }
  if (suffix) {
    return (
      <Text numberOfLines={1} style={[styles.cityNameContainer, style]}>
        <Text style={styles.cityName}>{`${prefix}  `}</Text>
        <Text>{suffix}</Text>
      </Text>
    );
  }
  return (
    <Text numberOfLines={1} style={[styles.cityNameContainer, style]}>
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
  weather?: Partial<Weather>;
  wingBlank: number;
}

const City: FC<CityProps> = ({ city, collapsed = false, weather = {}, wingBlank }) => {
  const [activeDay, setActiveDay] = useState(0 as number | true);
  const { forecast = [defaultForecast, defaultForecast, defaultForecast] } = weather;
  const timezone = getTimeZone(weather.timezone);
  return (
    <View style={[styles.container, { paddingHorizontal: wingBlank }]}>
      <CityName city={city} />
      {[0, 1, 2].map(index => (
        <Day
          key={index}
          disableHover={collapsed}
          forecast={forecast[index]}
          collapsed={collapsed || activeDay !== index}
          hourOffset={timezone && timezone + index * 24}
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
    position: 'relative',
  } as ViewStyle,
  cityNameContainer: {
    lineHeight: 48,
    color: Color.B2,
    fontSize: Font.$0.FS,
    marginBottom: PX(32),
  } as TextStyle,
  cityName: {
    color: Color.B0,
    fontWeight: '500',
    fontSize: Font.$2.FS,
  } as TextStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<CityProps>(City);
