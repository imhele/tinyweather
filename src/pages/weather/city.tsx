import { getLocale } from '@/components/intl';
import { Color, Font, PX } from '@/config';
import connect from '@/models';
import { City as CityModel } from '@/services/weather';
import React, { FC } from 'react';
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

export interface CityProps {
  city: CityModel;
  wingBlank: number;
}

const City: FC<CityProps> = ({ city, wingBlank }) => {
  return (
    <View style={[styles.container, { paddingHorizontal: wingBlank }]}>
      <CityName city={city} />
      <Day />
      <Day />
      <Day />
      <Day />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: PX.VW(100),
    position: 'relative',
  } as ViewStyle,
  cityNameContainer: {
    lineHeight: 48,
    color: Color.B2,
    fontSize: Font.$0.FS,
  } as TextStyle,
  cityName: {
    color: Color.B0,
    fontWeight: '500',
    fontSize: Font.$2.FS,
  } as TextStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<CityProps>(City);
