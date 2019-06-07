import { City, getWeather, searchCity, Weather } from '@/services/weather';
import { PowerPartial } from '@/utils/types';

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

const WeatherModel = {
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
    weatherData: [],
  } as WeatherState,
  reducers: {
    fetchWeather,
  },
};

export default WeatherModel;
