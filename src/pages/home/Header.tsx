import Icon from '@/components/Icon';
import intl from '@/components/intl';
import { Color } from '@/config';
import connect from '@/models';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
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
    <View style={{ width: 48 }}>
      <Icon type="scan" style={{ fontSize: 40, color: '#fff' }} />
    </View>
    <View
      style={{
        flex: 1,
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
      }}
    >
      <Text style={{ lineHeight: 40, fontSize: 16, color: Color.B3 }}>{intl.UA('搜索')}</Text>
    </View>
  </View>
);

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<HeaderProps>(Header);
