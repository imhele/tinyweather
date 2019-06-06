import images from '@/assets/image';
import { HoverScale } from '@/components/Animation';
import intl from '@/components/intl';
import { PX, Color } from '@/config';
import connect from '@/models';
import React, { FC } from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface ToolBarProps {
  itemStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  wingBlank: number;
}

const ToolBar: FC<ToolBarProps> = ({ imageStyle, itemStyle, style, textStyle, wingBlank }) => {
  return (
    <View style={[{ paddingHorizontal: wingBlank }, styles.container, style]}>
      {['toolbar-0', 'toolbar-1', 'toolbar-2', 'toolbar-3'].map(key => (
        <HoverScale key={key} style={[styles.item, itemStyle]}>
          <Image source={(images as any)[key]} style={[styles.imageItem, imageStyle]} />
          <Text style={[styles.textItem, textStyle]}>{intl(key as any)}</Text>
        </HoverScale>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 84,
    flexDirection: 'row',
    paddingVertical: 4,
  } as ViewStyle,
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  } as ViewStyle,
  imageItem: {
    width: 45,
    height: 45,
  } as ImageStyle,
  textItem: {
    fontSize: 12,
    fontWeight: '500',
    color: Color.TabBar.normal,
  } as TextStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<ToolBarProps>(ToolBar);
