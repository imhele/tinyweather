import connect from '@/models';
import { WeatherState } from '@/models/weather';
import { Carousel } from '@ant-design/react-native';
import React, { FC } from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import City from './city';
import { Color } from '@/config';

const Weather: FC<WeatherState> = ({ cities }) => {
  return (
    <View>
      <StatusBar animated barStyle="light-content" backgroundColor="rgba(255, 255, 255, 0)" />
      <Carousel dotActiveStyle={void 0} dotStyle={styles.dot}>
        {cities.map(city => (
          <City city={city} key={city.id} />
        ))}
      </Carousel>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    backgroundColor: Color.B4,
    bottom: 12,
    marginHorizontal: 4,
    position: 'relative',
  } as ViewStyle,
});

export default connect(({ weather }) => weather)<WeatherState>(Weather);
