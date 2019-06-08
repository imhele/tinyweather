import { HoverScale, HoverScaleProps } from '@/components/Animation';
import Icon from '@/components/Icon';
import intl, { getLocale } from '@/components/intl';
import { Color, Font, PX } from '@/config';
import connect from '@/models';
import { Forecast } from '@/services/weather';
import { mixStyle } from '@/utils';
import { useChange } from '@/utils/hooks';
import { WeatherColor, WeatherIcon } from '@/utils/weatherIcon';
import padStart from 'lodash/padStart';
import React, { FC, useCallback, useState } from 'react';
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
  const iconScale: any = new Animated.Value(collapsed ? 1 : 1.25);
  const ifs = [
    Animated.spring(iconScale, { toValue: 1.25, useNativeDriver: true }),
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
    if (active !== true && active < index) return PX(index * 232 + 320);
    return PX(index * 232);
  }
  return PX(32) * (1 - 1 / (index * index + 1));
};

const getLocaleFullDay = (date: Date) => {
  if (getLocale() !== 'zh-CN')
    return date
      .toUTCString()
      .split(' ')
      .slice(1, 4)
      .join(' ');
  return `${date.getUTCFullYear()} / ${date.getUTCMonth() + 1} / ${date.getUTCDate()}`;
};

const getUpdateTime = (str: string) => {
  if (!str) return '';
  try {
    const arr = str.split(' ');
    const [year, month, day] = arr[0].split('-');
    const date = new Date();
    date.setFullYear(parseInt(year, 10));
    date.setMonth(parseInt(month, 10) - 1);
    date.setDate(parseInt(day, 10));
    if (!date || date.toString() === 'Invalid Date') return intl.U('更新时间未知');
    const time = `${getLocaleFullDay(date)} ${arr[1]}`;
    return intl.U('更新时间', { time });
  } catch {
    return '';
  }
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
  const updateAt = useCallback(getUpdateTime, [forecast.updatetime])(forecast.updatetime);
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
          <View style={mixStyle(styles, { temperature: !clp, temperatureCLP: clp })}>
            <Text>
              <Text style={styles.tempDay}>{`${forecast.tempDay}°`}</Text>
              <Text style={styles.tempNight}>{padStart(`${forecast.tempNight}°`, 3)}</Text>
            </Text>
          </View>
          <Icon style={mixStyle(styles, { icon: true, iconCLP: clp }, animate.icon)} type={icon} />
          <View style={mixStyle(styles, { date: true, dateCLP: clp, dateHide: collapsed })}>
            <Text style={styles.localeDay}>{intl.localeDay(now)}</Text>
            <Text style={styles.fullDay}>{getLocaleFullDay(now)}</Text>
          </View>
          <View style={mixStyle(styles, { detailContainer: true, detailContainerCLP: clp })}>
            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>&nbsp;</Text>
                <Text style={styles.detailName}>{intl.U('温度')}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>{`${forecast.humidity}%`}</Text>
                <Text style={styles.detailName}>{intl.U('湿度')}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>
                  <Text style={styles.tempDay}>{`${forecast.windLevelDay} `}</Text>
                  <Text style={styles.tempNight}>{forecast.windLevelNight}</Text>
                </Text>
                <Text style={styles.detailName}>{intl.U('风级')}</Text>
              </View>
            </View>
            <Text style={styles.udpateTime}>{updateAt}</Text>
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
    height: PX(520),
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
    bottom: PX(48),
    color: Color.W2,
    fontSize: PX(200),
    position: 'relative',
  } as TextStyle,
  iconCLP: {
    bottom: 0,
    left: PX.VW(12),
    fontSize: PX(160),
  } as ViewStyle,
  temperature: {
    left: 0,
    width: '33%',
    height: PX(88),
    bottom: PX(112),
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
  temperatureCLP: {
    right: PX.VW(4),
    height: PX(200),
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    left: 0,
    top: PX(16),
    minWidth: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  dateCLP: {
    top: 0,
    minWidth: 0,
    left: PX.VW(4),
    height: PX(200),
    alignItems: 'flex-start',
  } as ViewStyle,
  dateHide: {
    left: PX.VW(-50),
    position: 'absolute',
  } as ViewStyle,
  localeDay: {
    color: Color.W0,
    fontSize: Font.$3.FS,
  } as TextStyle,
  fullDay: {
    color: Color.W2,
    fontSize: Font.$1.FS,
  } as TextStyle,
  detailContainer: {
    width: '100%',
    bottom: PX(16),
    position: 'absolute',
  } as ViewStyle,
  detailContainerCLP: {
    bottom: -200,
  } as TextStyle,
  detail: {
    width: '100%',
    height: PX(160),
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  divider: {
    width: 2,
    top: PX(8), // adjust
    height: PX(72),
    borderRadius: 1,
    backgroundColor: Color.W4,
  } as ViewStyle,
  detailItem: {
    flex: 1,
    flexDirection: 'column',
  } as ViewStyle,
  detailTitle: {
    color: Color.W0,
    lineHeight: PX(88),
    textAlign: 'center',
    fontSize: Font.$5.FS,
  } as TextStyle,
  detailName: {
    color: Color.W1,
    lineHeight: PX(40),
    textAlign: 'center',
    fontSize: Font.$1.FS,
  } as TextStyle,
  udpateTime: {
    color: Color.W2,
    marginTop: PX(8),
    lineHeight: PX(32),
    textAlign: 'center',
    fontSize: Font.$0.FS,
  } as TextStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<DayProps>(Day);
