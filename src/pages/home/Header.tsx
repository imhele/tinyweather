import { HoverScale } from '@/components/Animation';
import Icon from '@/components/Icon';
import intl from '@/components/intl';
import { Color, Font } from '@/config';
import connect from '@/models';
import React, { FC } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
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
      paddingVertical: 8,
    }}
  >
    <HoverScale opacity={{ activeOpacity: Color.Opacity[1] }}>
      <Icon type="scan" style={{ fontSize: 32, color: '#fff' }} />
    </HoverScale>
    <TouchableOpacity activeOpacity={Color.Opacity[1]} style={styles.searchBar}>
      <Text style={styles.searchText}>{intl.UA('搜索')}</Text>
      <Icon style={styles.searchIcon} type="search" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
    height: 32,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
  } as ViewStyle,
  searchText: {
    lineHeight: 32,
    color: Color.B3,
    fontSize: Font.$1.FS,
  } as TextStyle,
  searchIcon: {
    marginLeft: 8,
    lineHeight: 32,
    fontSize: Font.$4.FS,
    color: Color.Primary,
  } as TextStyle,
});

export default connect(({ global: { wingBlank } }) => ({ wingBlank }))<HeaderProps>(Header);
