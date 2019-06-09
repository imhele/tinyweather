import { HoverScale, PageContainer, ScaleView } from '@/components/Animation';
import { Color, Font } from '@/config';
import { callHook, registerHook } from '@/components/Hooks';
import intl, { getLocale } from '@/components/intl';
import connect, { dispatch } from '@/models';
import { WeatherState } from '@/models/weather';
import { FCN } from '@/utils/types';
import Modal from '@ant-design/react-native/es/modal';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { back } from '@/layouts/Routes';

registerHook('afterAddCity');

const onAddCity = ({ cities, searchRes }: WeatherState, index: number) => {
  const city = searchRes[index];
  const cityName = getLocale() === 'zh-CN' ? city.county : city.en;
  Modal.alert(intl.U('确认'), intl.U('确认添加城市', { cityName }), [
    { text: intl.U('取消') },
    {
      text: intl.U('确认'),
      onPress: () => {
        back();
        const nextIndex = cities.length;
        dispatch.weather.addCity(index).then(() => {
          callHook('afterAddCity', nextIndex);
        });
      },
    },
  ]);
};

interface SearchProps {
  weather: WeatherState;
}

const Search: FCN<SearchProps> = ({ weather }) => {
  const { searchRes } = weather;
  const [focus, setFocus] = useState(false);
  const [inputText, setInputText] = useState('');
  const onBack = () => back();
  const onFocus = () => {
    if (focus) return;
    LayoutAnimation.easeInEaseOut();
    setFocus(true);
  };
  const onBlur = () => {
    if (!focus) return;
    LayoutAnimation.easeInEaseOut();
    setFocus(false);
  };
  const onChange = (search: string) => {
    dispatch.weather.searchCity(search).then(() => setInputText(search));
  };
  const backTextStyle: TextStyle = {
    lineHeight: 32,
    fontWeight: '500',
    color: Color.Primary,
    fontSize: Font.$2.FS,
    paddingRight: focus ? 0 : 16,
    width: focus ? 0 : undefined,
  };
  const PlaceHolder = focus ? '' : <Text style={{ color: Color.B2 }}>{intl.U('搜索城市')}</Text>;

  return (
    <PageContainer>
      <StatusBar animated barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.searchBar}>
        <HoverScale onPress={onBack} opacity={{ activeOpacity: Color.Opacity[1] }}>
          <Text ellipsizeMode="clip" numberOfLines={1} style={backTextStyle}>
            {intl.U('返回')}
          </Text>
        </HoverScale>
        <TextInput onBlur={onBlur} onChangeText={onChange} onFocus={onFocus} style={styles.input}>
          {inputText || PlaceHolder}
        </TextInput>
      </View>
      {searchRes &&
        searchRes.map((city, index) => (
          <ScaleView key={city.id} visible>
            <HoverScale onPress={() => onAddCity(weather, index)} style={styles.resultItem}>
              <Text numberOfLines={1}>
                <Text style={styles.title}>
                  {intl.localeName === 'en-US' ? city.en : city.county}
                </Text>
                {intl.localeName === 'en-US' || (
                  <Text style={styles.desc}>
                    {city.province === city.city
                      ? ` ${city.city}`
                      : ` ${city.province}${city.city}`}
                  </Text>
                )}
              </Text>
            </HoverScale>
          </ScaleView>
        ))}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    height: 64,
    padding: 16,
    flexDirection: 'row',
  } as ViewStyle,
  input: {
    flex: 1,
    color: Color.B0,
    borderRadius: 16,
    paddingVertical: 0,
    fontSize: Font.$2.FS,
    paddingHorizontal: 16,
    backgroundColor: Color.B6,
  } as TextStyle,
  resultItem: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: Color.B7,
  } as ViewStyle,
  title: {
    fontSize: 18,
    color: Color.B0,
    fontWeight: '500',
  } as TextStyle,
  desc: {
    color: Color.B2,
    fontSize: Font.$1.FS,
  } as TextStyle,
});

Search.navigationOptions = {
  header: null,
};

export default connect(({ weather }) => ({ weather }))<SearchProps>(Search);
