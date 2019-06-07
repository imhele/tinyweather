import { HoverScale } from '@/components/Animation';
import Icon from '@/components/Icon';
import { Color, Font, PX } from '@/config';
import connect from '@/models';
import { Forecast } from '@/services/weather';
import { WeatherColor, WeatherIcon } from '@/utils/weatherIcon';
import React, { FC, useState } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { BoxShadow } from 'react-native-shadow';

export interface DayProps {
  forecast: Forecast;
  style?: StyleProp<ViewStyle>;
  wingBlank: number;
}

const Day: FC<DayProps> = ({ forecast, style, wingBlank }) => {
  const [isNight, setNight] = useState(false);
  const status = isNight ? forecast.conditionIdNight : forecast.conditionIdDay;
  const icon = WeatherIcon[status];
  const color = WeatherColor[icon];

  const shadowOpt = {
    color,
    opacity: 0.32,
    border: PX(24),
    height: PX(200),
    radius: styles.container.borderRadius,
    width: PX.Device.Width - wingBlank * 2,
    style: { position: 'absolute', top: PX(16), scaleX: 0.9, scaleY: 0.9 } as ViewStyle,
  };

  return (
    <HoverScale scale={[1, 0.92]}>
      <View style={[styles.container, { backgroundColor: color }, style]}>
        <BoxShadow setting={shadowOpt} />
        <View style={styles.temperature}>
          <Text>
            <Text style={styles.tempDay}>{`${forecast.tempDay}°`}</Text>
            <Text style={styles.tempNight}>{`${forecast.tempNight}°`}</Text>
          </Text>
        </View>
        <Icon style={styles.icon} type={icon} />
      </View>
    </HoverScale>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PX(200),
    alignItems: 'center',
    borderRadius: PX(32),
    marginBottom: PX(32),
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

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<DayProps>(Day);
