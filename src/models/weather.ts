import { City, getWeather, searchCity, Weather } from '@/services/weather';
import { PowerPartial } from '@/utils/types';
import throttle from 'lodash/throttle';

export interface WeatherState {
  cities: City[];
  weatherData: (Weather | undefined)[];
}

const fetchWeather = async (
  pageIndex: number,
  state?: any,
): Promise<PowerPartial<WeatherState> | null> => {
  const weather: WeatherState = state.weather;
  const response = await getWeather(weather.cities[pageIndex].id);
  if (!response) return null;
  const weatherData = [...weather.weatherData];
  weatherData[pageIndex] = response;
  return { weatherData };
};

const example: Weather = {
  timezone: '8',
  forecast: [
    {
      conditionDay: '多云',
      conditionIdDay: '1',
      conditionIdNight: '4',
      conditionNight: '雷阵雨',
      humidity: '59',
      predictDate: '2019-06-07',
      tempDay: '31',
      tempNight: '19',
      updatetime: '2019-06-07 16:08:00',
      windDegreesDay: '180',
      windDegreesNight: '0',
      windDirDay: '南风',
      windDirNight: '北风',
      windLevelDay: '3-4',
      windLevelNight: '3',
    },
    {
      conditionDay: '多云',
      conditionIdDay: '1',
      conditionIdNight: '30',
      conditionNight: '晴',
      humidity: '34',
      predictDate: '2019-06-08',
      tempDay: '34',
      tempNight: '20',
      updatetime: '2019-06-07 16:08:00',
      windDegreesDay: '225',
      windDegreesNight: '0',
      windDirDay: '西南风',
      windDirNight: '北风',
      windLevelDay: '3-4',
      windLevelNight: '3-4',
    },
    {
      conditionDay: '多云',
      conditionIdDay: '1',
      conditionIdNight: '30',
      conditionNight: '晴',
      humidity: '35',
      predictDate: '2019-06-09',
      tempDay: '32',
      tempNight: '19',
      updatetime: '2019-06-07 16:08:00',
      windDegreesDay: '0',
      windDegreesNight: '45',
      windDirDay: '北风',
      windDirNight: '东北风',
      windLevelDay: '3-4',
      windLevelNight: '3',
    },
  ],
};

const WeatherModel = {
  state: {
    cities: [
      {
        id: 2,
        province: '北京市',
        city: '北京市',
        county: '北京市',
        en: 'Beijing',
      },
      {
        id: 3,
        province: '北京市',
        city: '北京市',
        county: '朝阳区',
        en: 'Chaoyang District District',
      },
    ],
    weatherData: [example],
  } as WeatherState,
  reducers: {
    fetchWeather: throttle(fetchWeather, 100),
  },
};

export default WeatherModel;
