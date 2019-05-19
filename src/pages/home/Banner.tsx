import { Color, PX } from '@/config';
import connect from '@/models';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

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
          left: 0,
          width: PX.Device.Width,
          height: bannerHeight / 2,
          backgroundColor: Color.Primary,
        }}
      />
      <View style={{ flex: 1, borderRadius: 8, backgroundColor: Color.Theme[2] }}>
        <Text style={{ textAlign: 'center', fontSize: PX(16), color: Color.Primary }}>
          Banner Here.
        </Text>
      </View>
    </View>
  );
};

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<BannerProps>(Banner);
