import { Color, PX } from '@/config';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import connect from '@/models';

interface BannerProps {
  wingBlank: number;
}

const Banner: FC<BannerProps> = ({ wingBlank }) => {
  const paddingVertical = 12;
  const paddingHorizontal = wingBlank;
  const bannerWidth = PX.Device.Width - paddingHorizontal * 2;
  const bannerHeight = bannerWidth / 2;
  return (
    <View style={{ height: bannerHeight, paddingHorizontal, paddingVertical }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          height: bannerHeight / 2,
          backgroundColor: Color.Primary,
        }}
      />
      <View style={{ flex: 1, backgroundColor: Color.Theme[2] }}>
        <Text style={{ flex: 1 }}>Banner Here.</Text>
      </View>
    </View>
  );
};

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<BannerProps>(Banner);
