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
import { Animated, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { BoxShadow } from 'react-native-shadow';

const createAnimate = (collapsed: boolean) => {
  const iconScale: any = new Animated.Value(collapsed ? 1 : 1.2);
  const is = [
    Animated.spring(iconScale, { toValue: 1.2, useNativeDriver: true }),
    Animated.spring(iconScale, { toValue: 1, useNativeDriver: true }),
  ];
  return {
    icon: {
      transform: [{ scale: iconScale }],
    } as TextStyle,
    come: () => {
      is[1].stop();
      is[0].start();
    },
    back: () => {
      is[0].stop();
      is[1].start();
    },
  };
};

const getTop = (index: number, collapsed: boolean, active: true | number) => {
  if (!collapsed) {
    if (active !== true && active < index) return index * 116 + 160;
    return index * 116;
  }
  return 16 * (1 - 1 / (index * index + 1));
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
  const dayVal = { temp: forecast.tempDay, wind: forecast.windLevelDay };
  const nightVal = { temp: forecast.tempNight, wind: forecast.windLevelNight };
  const valueLeft = isNight ? nightVal : dayVal;
  const valueRight = isNight ? dayVal : nightVal;
  const icon = WeatherIcon[status];
  const color = WeatherColor[icon];
  if (useChange(clp)) {
    if (clp) animate.back();
    else animate.come();
  }

  const containerStyle: ViewStyle = {
    left: wingBlank,
    width: PX.Device.Width - wingBlank * 2,
    top: getTop(index, collapsed, activeDay),
    opacity: collapsed ? 1 / (index * index + 1) : 1,
    transform: collapsed ? [{ scale: 1 - index * 0.04 }] : [],
  };
  const shadowOpt = {
    color,
    border: 12,
    height: 100,
    opacity: 0.32,
    radius: styles.card.borderRadius,
    width: PX.Device.Width - wingBlank * 2,
    style: {
      position: 'absolute',
      bottom: collapsed ? 0 : -8,
      transform: [{ scale: 0.9 }],
    } as ViewStyle,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <HoverScale disabled={collapsed} scale={[1, 0.92]} {...restProps}>
        <View style={mixStyle(styles, { card: true, cardCLP: clp }, { backgroundColor: color })}>
          <BoxShadow setting={shadowOpt} />
          <View style={mixStyle(styles, { temperature: !clp, temperatureCLP: clp })}>
            <Text>
              <Text style={styles.valueLeft}>{`${valueLeft.temp}°`}</Text>
              <Text style={styles.valueRight}>{padStart(`${valueRight.temp}°`, 3)}</Text>
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
                  <Text style={styles.valueLeft}>{`${valueLeft.wind} `}</Text>
                  <Text style={styles.valueRight}>{valueRight.wind}</Text>
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
    paddingBottom: 16,
    overflow: 'hidden',
    position: 'absolute',
  } as ViewStyle,
  card: {
    height: 260,
    marginBottom: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  cardCLP: {
    height: 100,
  } as ViewStyle,
  icon: {
    left: 0,
    bottom: 24,
    fontSize: 72,
    color: Color.W2,
    position: 'relative',
  } as TextStyle,
  iconCLP: {
    bottom: 0,
    fontSize: 72,
    left: PX.VW(14),
  } as ViewStyle,
  temperature: {
    left: 0,
    height: 44,
    bottom: 56,
    width: '33%',
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
  temperatureCLP: {
    height: 100,
    right: PX.VW(4),
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  } as ViewStyle,
  valueLeft: {
    color: Color.W0,
    fontSize: Font.$5.FS,
  } as TextStyle,
  valueRight: {
    color: Color.W2,
    fontSize: Font.$2.FS,
  } as TextStyle,
  date: {
    top: 8,
    left: 0,
    minWidth: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  dateCLP: {
    top: 0,
    height: 100,
    minWidth: 0,
    left: PX.VW(4),
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
    bottom: 8,
    width: '100%',
    position: 'absolute',
  } as ViewStyle,
  detailContainerCLP: {
    bottom: -200,
  } as TextStyle,
  detail: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  divider: {
    top: 4, // adjust
    width: 2,
    height: 36,
    borderRadius: 1,
    backgroundColor: Color.W4,
  } as ViewStyle,
  detailItem: {
    flex: 1,
    flexDirection: 'column',
  } as ViewStyle,
  detailTitle: {
    lineHeight: 44,
    color: Color.W0,
    textAlign: 'center',
    fontSize: Font.$5.FS,
  } as TextStyle,
  detailName: {
    lineHeight: 20,
    color: Color.W1,
    textAlign: 'center',
    fontSize: Font.$1.FS,
  } as TextStyle,
  udpateTime: {
    marginTop: 4,
    lineHeight: 16,
    color: Color.W2,
    textAlign: 'center',
    fontSize: Font.$0.FS,
  } as TextStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<DayProps>(Day);
