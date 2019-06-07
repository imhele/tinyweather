import { HoverScale } from '@/components/Animation';
import Icon from '@/components/Icon';
import { Color, Font, PX } from '@/config';
import { Forecast } from '@/services/weather';
import { WeatherColor, WeatherIcon } from '@/utils/weatherIcon';
import React, { FC, useState } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

export interface DayProps {
  style?: StyleProp<ViewStyle>;
  forecast: Forecast;
}

const Day: FC<DayProps> = ({ forecast, style }) => {
  const [isNight, setNight] = useState(false);
  const status = isNight ? forecast.conditionIdNight : forecast.conditionIdDay;
  const icon = WeatherIcon[status];
  const color = WeatherColor[icon];
  return (
    <HoverScale scale={[1, 0.92]} style={[styles.container, { backgroundColor: color }, style]}>
      <View style={styles.temperature}>
        <Text>
          <Text style={styles.tempDay}>{`${forecast.tempDay}°`}</Text>
          <Text style={styles.tempNight}>{`${forecast.tempNight}°`}</Text>
        </Text>
      </View>
      <Icon style={styles.icon} type={icon} />
    </HoverScale>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PX(200),
    alignItems: 'center',
    borderRadius: PX(32),
    marginVertical: PX(16),
    backgroundColor: '#000',
    justifyContent: 'center',
  } as ViewStyle,
  icon: {
    left: PX.VW(12),
    color: Color.W2,
    fontSize: PX(160),
    position: 'relative',
  } as TextStyle,
  temperature: {
    height: PX(200),
    right: PX.VW(4),
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  tempDay: {
    color: Color.W0,
    fontSize: Font.$5.FS,
  } as TextStyle,
  tempNight: {
    color: Color.W2,
    fontSize: Font.$2.FS,
  } as TextStyle,
});

export default Day;
