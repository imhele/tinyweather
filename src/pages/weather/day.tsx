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
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { BoxShadow } from 'react-native-shadow';

const createAnimate = (collapsed: boolean) => {
  const iconFontSize: any = new Animated.Value(collapsed ? PX(160) : PX(240));
  const ifs = [
    Animated.timing(iconFontSize, { toValue: PX(240), useNativeDriver: true }),
    Animated.timing(iconFontSize, { toValue: PX(160), useNativeDriver: true }),
  ];
  return {
    icon: {
      fontSize: iconFontSize,
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

export interface DayProps extends HoverScaleProps {
  collapsed?: boolean;
  disableHover?: boolean;
  forecast: Forecast;
  hourOffset?: number;
  wingBlank: number;
}

const Day: FC<DayProps> = ({
  collapsed = true,
  disableHover = false,
  forecast,
  hourOffset = 8,
  wingBlank,
  ...restProps
}) => {
  // const animate = useState(() => createAnimate(collapsed))[0];
  const now = new Date(Date.now() + 1000 * 60 * 60 * hourOffset);
  const isNight = now.getUTCHours() > 18 || now.getUTCHours() < 7;
  const status = isNight ? forecast.conditionIdNight : forecast.conditionIdDay;
  const icon = WeatherIcon[status];
  const color = WeatherColor[icon];
  if (useChange(collapsed)) {
    LayoutAnimation.spring();
    // if (collapsed) animate.back();
    // else animate.come();
  }

  const containerStyle = mixStyle(styles, { container: true, containerCLP: collapsed });
  const shadowOpt = {
    color,
    opacity: 0.32,
    border: PX(24),
    height: PX(200),
    radius: styles.container.borderRadius,
    width: PX.Device.Width - wingBlank * 2,
    style: { position: 'absolute', bottom: PX(-16), scaleX: 0.9, scaleY: 0.9 } as ViewStyle,
  };

  return (
    <HoverScale disabled={disableHover} scale={[1, 0.92]} {...restProps}>
      <View style={[containerStyle, { backgroundColor: color }]}>
        <BoxShadow setting={shadowOpt} />
        <View style={mixStyle(styles, { temperature: true, temperatureCLP: collapsed })}>
          <Text>
            <Text style={styles.tempDay}>{`${forecast.tempDay}°`}</Text>
            <Text style={styles.tempNight}>{`${forecast.tempNight}°`}</Text>
          </Text>
        </View>
        <Icon style={mixStyle(styles, { icon: true, iconCLP: collapsed })} type={icon} />
        <View style={mixStyle(styles, { date: true, dateCLP: collapsed })}>
          <Text>
            <Text style={styles.tempDay}>{now.getUTCDate()}</Text>
            <Text style={styles.tempNight}>{now.getUTCMonth()}</Text>
          </Text>
        </View>
      </View>
    </HoverScale>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PX(480),
    alignItems: 'center',
    borderRadius: PX(32),
    marginBottom: PX(32),
    justifyContent: 'center',
  } as ViewStyle,
  containerCLP: {
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
