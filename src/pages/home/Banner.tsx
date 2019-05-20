import { HoverScale } from '@/components/Animation';
import { Color, PX, Ratio } from '@/config';
import connect from '@/models';
import { Banner as BannerData } from '@/models/home';
import Carousel from '@ant-design/react-native/es/carousel';
import React, { FC } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface BannerProps {
  banners: BannerData[];
  wingBlank: number;
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const Banner: FC<BannerProps> = ({ banners, style, wingBlank, wrapperStyle }) => {
  const marginVertical = 12;
  const marginHorizontal = wingBlank;
  const bannerWidth = PX.Device.Width - marginHorizontal * 2;
  const bannerHeight = bannerWidth * Ratio.Banner;
  const ItemStyle: ImageStyle = {
    width: bannerWidth,
    height: bannerHeight,
    marginHorizontal,
    marginVertical,
  };

  return (
    <View style={wrapperStyle}>
      <View style={[styles.backGround, { height: bannerHeight / 2 }]} />
      <Carousel
        autoplay
        autoplayInterval={5000}
        dotActiveStyle={styles.dotActive}
        dotStyle={styles.dot}
        infinite
        style={style}
      >
        {banners.map(banner => (
          <HoverScale key={banner.key}>
            <Image source={banner.source} style={[styles.bannerItem, ItemStyle]} />
          </HoverScale>
        ))}
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
    borderRadius: 4,
  } as ImageStyle,
  backGround: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PX.Device.Width,
    backgroundColor: Color.Primary,
  } as ViewStyle,
});

export default connect(({ global: { wingBlank }, home: { banners } }) => ({ banners, wingBlank }))<
  BannerProps
>(Banner);
