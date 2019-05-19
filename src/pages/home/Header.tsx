import Icon from '@/components/Icon';
import intl from '@/components/intl';
import { FCN } from '@/utils/types';
import React from 'react';
import { Text, View } from 'react-native';
import { Color, PX } from '@/config';

const Header: FCN = ({ navigation }) => (
  <View
    style={{
      backgroundColor: Color.Primary,
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingVertical: 12,
    }}
  >
    <View style={{ width: 48 }}>
      <Icon type="scan" style={{ fontSize: 40, color: '#fff' }} />
    </View>
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        height: 40,
        borderRadius: PX(4),
      }}
    >
      <Text>{intl('搜索')}</Text>
    </View>
  </View>
);

export default Header;
