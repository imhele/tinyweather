import { HoverScale, HoverScaleProps } from '@/components/Animation';
import Icon from '@/components/Icon';
import { Color, Font, PX } from '@/config';
import connect from '@/models';
import { Forecast } from '@/services/weather';
import { mixStyle } from '@/utils';
import { useChange } from '@/utils/hooks';
import { WeatherColor, WeatherIcon } from '@/utils/weatherIcon';
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
import { BoxShadow } from 'react-native-shadow';

const createAnimate = (collapsed: boolean) => {
  const iconScale: any = new Animated.Value(collapsed ? 1 : 1.5);
  const ifs = [
    Animated.spring(iconScale, { toValue: 1.5, useNativeDriver: true }),
    Animated.spring(iconScale, { toValue: 1, useNativeDriver: true }),
  ];
  return {
    icon: {
      transform: [{ scale: iconScale }],
    } as TextStyle,
    come: () => {
      ifs[1].stop();
      ifs[0].start();
    },
    back: () => {
      ifs[0].stop();
      ifs[1].start();
    },
  };
};

const getTop = (index: number, collapsed: boolean, active: true | number) => {
  if (!collapsed) {
    if (active !== true && active < index) return PX(index * 232 + 280);
    return PX(index * 232);
  }
  return PX(32) * (1 - 1 / (index * index + 1));
};

export interface DayProps extends HoverScaleProps {
  activeDay?: number | true;
  collapsed?: boolean;
  forecast: Forecast;
  index: number;
  timezone?: number;
  wingBlank: number;
}

const Day: FC<DayProps> = ({
  activeDay = true,
  collapsed = true,
  forecast,
  index,
  timezone = 8,
  wingBlank,
  ...restProps
}) => {
  const clp = collapsed || activeDay !== index;
  const animate = useState(() => createAnimate(clp))[0];
  const now = new Date(Date.now() + 3600000 * (timezone + index * 24));
  const isNight = now.getUTCHours() > 18 || now.getUTCHours() < 7;
  const status = isNight ? forecast.conditionIdNight : forecast.conditionIdDay;
  const icon = WeatherIcon[status];
  const color = WeatherColor[icon];
  if (useChange(clp)) {
    LayoutAnimation.spring();
    if (clp) animate.back();
    else animate.come();
  }

  const containerStyle: ViewStyle = {
    left: wingBlank,
    position: 'absolute',
    paddingBottom: PX(32),
    width: PX.Device.Width - wingBlank * 2,
    top: getTop(index, collapsed, activeDay),
    opacity: collapsed ? 1 / (index * index + 1) : 1,
    transform: collapsed ? [{ scale: 1 - index * 0.04 }] : [],
  };
  const shadowOpt = {
    color,
    opacity: 0.32,
    border: PX(24),
    height: PX(200),
    radius: styles.card.borderRadius,
    width: PX.Device.Width - wingBlank * 2,
    style: {
      position: 'absolute',
      bottom: collapsed ? 0 : PX(-16),
      transform: [{ scale: 0.9 }],
    } as ViewStyle,
  };

  return (
    <View style={containerStyle}>
      <HoverScale disabled={collapsed} scale={[1, 0.92]} {...restProps}>
        <View style={mixStyle(styles, { card: true, cardCLP: clp }, { backgroundColor: color })}>
          <BoxShadow setting={shadowOpt} />
          <View style={mixStyle(styles, { temperature: true, temperatureCLP: clp })}>
            <Text>
              <Text style={styles.tempDay}>{`${forecast.tempDay}°`}</Text>
              <Text style={styles.tempNight}>{`${forecast.tempNight}°`}</Text>
            </Text>
          </View>
          <Icon style={mixStyle(styles, { icon: true, iconCLP: clp }, animate.icon)} type={icon} />
          <View style={mixStyle(styles, { date: true, dateCLP: clp })}>
            <Text>
              <Text style={styles.tempDay}>{now.getUTCDate()}</Text>
              <Text style={styles.tempNight}>{now.getUTCMonth() + 1}</Text>
            </Text>
          </View>
        </View>
      </HoverScale>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PX(512),
  } as ViewStyle,
  containerCLP: {
    height: PX(232),
  } as ViewStyle,
  card: {
    height: PX(480),
    alignItems: 'center',
    marginBottom: PX(32),
    borderRadius: PX(32),
    justifyContent: 'center',
  } as ViewStyle,
  cardCLP: {
    height: PX(200),
  } as ViewStyle,
  icon: {
    left: 0,
    color: Color.W2,
    fontSize: PX(240),
    position: 'relative',
  } as TextStyle,
  iconCLP: {
    left: PX.VW(12),
    fontSize: PX(160),
  } as ViewStyle,
  temperature: {
    height: PX(480),
    right: PX.VW(4),
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  temperatureCLP: {
    height: PX(200),
  } as ViewStyle,
  tempDay: {
    color: Color.W0,
    fontSize: Font.$5.FS,
  } as TextStyle,
  tempNight: {
    color: Color.W2,
    fontSize: Font.$2.FS,
  } as TextStyle,
  date: {
    height: PX(480),
    left: PX.VW(4),
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  dateCLP: {
    height: PX(200),
  } as ViewStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<DayProps>(Day);
