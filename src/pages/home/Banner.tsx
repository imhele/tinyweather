import { HoverScale } from '@/components/Animation';
import { Color, PX } from '@/config';
import connect from '@/models';
import Carousel from '@ant-design/react-native/es/carousel';
import React, { FC } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface BannerProps {
  wingBlank: number;
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const Banner: FC<BannerProps> = ({ style, wingBlank, wrapperStyle }) => {
  const marginVertical = 12;
  const marginHorizontal = wingBlank;
  const bannerWidth = PX.Device.Width - marginHorizontal * 2;
  const bannerHeight = bannerWidth / 2;
  const ItemStyle: ViewStyle = {
    width: bannerWidth,
    height: bannerHeight,
    marginHorizontal,
    marginVertical,
  };

  return (
    <View style={wrapperStyle}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: PX.Device.Width,
          height: bannerHeight / 2,
          backgroundColor: Color.Primary,
        }}
      />
      <Carousel
        autoplay
        autoplayInterval={5000}
        dotActiveStyle={styles.dotActive}
        dotStyle={styles.dot}
        infinite
        style={style}
      >
        <HoverScale style={[styles.bannerItem, ItemStyle]}>
          <Text style={{ textAlign: 'center', fontSize: PX(16), color: Color.Primary }}>
            Banner Here.
          </Text>
        </HoverScale>
        <HoverScale style={[styles.bannerItem, ItemStyle]}>
          <Text style={{ textAlign: 'center', fontSize: PX(16), color: Color.Primary }}>
            Banner Here.
          </Text>
        </HoverScale>
      </Carousel>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    bottom: 12,
    marginHorizontal: 4,
    position: 'relative',
  } as ViewStyle,
  dotActive: {
    backgroundColor: Color.Primary,
    borderWidth: 0,
  } as ViewStyle,
  bannerItem: {
    borderRadius: 8,
    backgroundColor: Color.Theme[1],
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<BannerProps>(Banner);
