import { HoverScale } from '@/components/Animation';
import { getLocale } from '@/components/intl';
import { Color, Font, PX } from '@/config';
import connect from '@/models';
import { City as CityModel, Forecast, Weather } from '@/services/weather';
import { mixStyle } from '@/utils';
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
import Day from './day';

const CityName: FC<{
  city: CityModel;
  isWhite?: boolean;
  style?: StyleProp<TextStyle>;
}> = ({ city, isWhite, style }) => {
  let prefix = city.en;
  let suffix: string | undefined;
  const color = isWhite ? [Color.W0, Color.W1] : [Color.B0, Color.B1];
  if (getLocale() === 'zh-CN') {
    prefix = city.county;
    if (city.county !== city.city) suffix = city.city;
    else if (city.county !== city.province) suffix = city.province;
  }
  if (suffix)
    return (
      <Animated.Text numberOfLines={1} style={style}>
        <Text style={[styles.btnText, { color: color[0] }]}>{`${prefix}  `}</Text>
        <Text style={[styles.btnDesc, { color: color[1] }]}>{suffix}</Text>
      </Animated.Text>
    );
  return (
    <Animated.Text numberOfLines={1} style={style}>
      <Text style={[styles.btnText, { color: color[0] }]}>{prefix}</Text>
    </Animated.Text>
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

const geHeight = (days: number, activeDay: number | true, collapsed: boolean) => {
  if (collapsed) return 120;
  if (activeDay === true) return days * 116;
  return days * 116 + 160;
};

export const getTimeZone = (t?: string) =>
  t && t.search(/\D/) === -1 ? parseInt(t, 10) : undefined;

export interface CityProps {
  city: CityModel;
  cityNameStyle?: TextStyle;
  collapsed?: boolean;
  index: number;
  onClickCity?: () => void;
  weather?: Partial<Weather>;
  wingBlank: number;
}

const City: FC<CityProps> = ({
  city,
  cityNameStyle,
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
    top: collapsed ? cityIndex * 120 : 0,
    height: geHeight(3, activeDay, collapsed),
    left: collapsed ? cityIndex * PX.VW(-100) : 0,
  };

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
          onPress={() => {
            if (collapsed) return;
            LayoutAnimation.spring();
            setActiveDay(index === activeDay || index);
          }}
        />
      ))}
      <HoverScale
        disabled={collapsed}
        onPress={onClickCity}
        style={styles.btnContainer}
        opacity={{ activeOpacity: collapsed ? 1 : Color.Opacity[1] }}
        wrapperStyle={mixStyle(
          styles,
          { btnWrapper: true, btnWrapperCLP: collapsed },
          { left: collapsed ? PX.VW(4) + wingBlank : wingBlank },
        )}
      >
        <CityName city={city} isWhite />
        <CityName city={city} style={[{ top: -32 }, cityNameStyle]} />
      </HoverScale>
    </View>
  );
};

// for `index.tsx`
export const styles = StyleSheet.create({
  container: {
    width: PX.VW(100),
    marginTop: 48 + 16,
  } as ViewStyle,
  btnWrapper: {
    height: 32,
    maxWidth: '100%',
    position: 'absolute',
    top: 0 - (32 + 48 + 16) / 2,
  } as ViewStyle,
  btnWrapperCLP: {
    top: 50 - 16,
    maxWidth: PX.VW(45),
  } as ViewStyle,
  btnContainer: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: Color.B6,
  } as ViewStyle,
  btnText: {
    lineHeight: 32,
    color: Color.W0,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: Font.$2.FS,
  } as TextStyle,
  btnDesc: {
    color: Color.W1,
    fontSize: Font.$0.FS,
  } as TextStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<CityProps>(City);
