import Icon from '@/components/Icon';
import intl from '@/components/intl';
import { Color } from '@/config';
import connect from '@/models';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

interface HeaderProps {
  navigation: NavigationScreenProp<any>;
  wingBlank: number;
}

const Header: FC<HeaderProps> = ({ wingBlank }) => (
  <View
    style={{
      backgroundColor: Color.Primary,
      flexDirection: 'row',
      paddingHorizontal: wingBlank,
      paddingVertical: 12,
    }}
  >
    <TouchableOpacity activeOpacity={Color.Opacity[1]} style={{ width: 48 }}>
      <Icon type="scan" style={{ fontSize: 40, color: '#fff' }} />
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={Color.Opacity[1]}
      style={{
        flex: 1,
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
      }}
    >
      <Text style={{ lineHeight: 40, fontSize: 16, color: Color.B3 }}>{intl.UA('搜索')}</Text>
    </TouchableOpacity>
  </View>
);

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<HeaderProps>(Header);
