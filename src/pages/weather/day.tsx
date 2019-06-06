import { HoverScale } from '@/components/Animation';
import { PX } from '@/config';
import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export interface DayProps {
  style?: StyleProp<ViewStyle>;
}

const Day: FC<DayProps> = ({ style }) => {
  return (
    <HoverScale scale={[1, 0.92]} style={[styles.container, style]}>
      <View />
    </HoverScale>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PX(200),
    borderRadius: PX(32),
    marginVertical: PX(16),
    backgroundColor: '#000',
  } as ViewStyle,
});

export default Day;
