import { City, getWeather, searchCity, Weather } from '@/services/weather';

export interface WeatherState {
  cities: City[];
}

const weather = {
  state: {
    cities: [
      {
        id: 22,
        province: '北京市',
        city: '北京市',
        county: '海淀区',
        en: 'Haidian District',
      },
      {
        id: 3,
        province: '北京市',
        city: '北京市',
        county: '朝阳区',
        en: 'Chaoyang District',
      },
    ],
  } as WeatherState,
  reducers: {},
};

export default weather;
