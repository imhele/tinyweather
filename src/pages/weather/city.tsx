import { getLocale } from '@/components/intl';
import { City as CityModel } from '@/services/weather';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

export interface CityProps {
  city: CityModel;
}

const CityName: FC<{ city: CityModel }> = ({ city }) => {
  let prefix = city.en;
  let suffix: string | undefined;
  if (getLocale() === 'zh-CN') {
    prefix = city.county;
    if (city.county !== city.city) suffix = city.city;
    else if (city.county !== city.province) suffix = city.province;
  }
  if (suffix) {
    return (
      <View>
        <Text>{prefix}</Text>
        <Text>{suffix}</Text>
      </View>
    );
  }
  return (
    <View>
      <Text>{prefix}</Text>
    </View>
  );
};

const City: FC<CityProps> = ({ city }) => {
  return (
    <View>
      <CityName city={city} />
    </View>
  );
};

export default City;
