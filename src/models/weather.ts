import { City, getWeather, searchCity, Weather } from '@/services/weather';
import { PowerPartial } from '@/utils/types';
import throttle from 'lodash/throttle';
import { AsyncStorage, LayoutAnimation } from 'react-native';
import { setState, $STATE } from './index';

export { City, Weather };
export interface WeatherState {
  cities: City[];
  searchRes: City[];
  weatherData: (Weather | undefined)[];
}

const persist = (update: Partial<WeatherState>, weather: WeatherState) => {
  AsyncStorage.setItem('Weather', JSON.stringify({ ...weather, ...update, searchRes: [] }));
};

const fetchWeather = async (
  pageIndex: number,
  state?: any,
): Promise<PowerPartial<WeatherState> | null> => {
  const weather: WeatherState = state.weather;
  const response = await getWeather([weather.cities[pageIndex].id]);
  if (!response) return null;
  const weatherData = [...weather.weatherData];
  weatherData[pageIndex] = response[0];
  persist({ weatherData }, weather);
  return { weatherData };
};

const bacthFetchWeather = async (
  pageIndexs: number[],
  state?: any,
): Promise<PowerPartial<WeatherState> | null> => {
  const weather: WeatherState = state.weather;
  const tasks = pageIndexs.map(i => weather.cities[i].id);
  const response = await getWeather(tasks);
  if (!response) return null;
  const weatherData = [...weather.weatherData];
  pageIndexs.forEach((i, index) => {
    const res = response[index];
    if (res) weatherData[i] = res;
  });
  persist({ weatherData }, weather);
  return { weatherData };
};

const deleteCity = async (index: number, state?: any) => {
  const weather: WeatherState = state.weather;
  const { cities, weatherData } = weather;
  cities.splice(index, 1);
  weatherData.splice(index, 1);
  persist({ cities, weatherData }, weather);
  LayoutAnimation.spring();
  return { cities: [...cities], weatherData: [...weatherData] };
};

const addCity = async (index: number, state?: any) => {
  const weather: WeatherState = state.weather;
  if (!weather.searchRes[index]) return null;
  const cities = [weather.searchRes[index], ...weather.cities];
  const weatherData = [, ...weather.weatherData];
  persist({ cities, weatherData }, weather);
  LayoutAnimation.spring();
  return { searchRes: [], cities, weatherData };
};

const defaultCity = {
  id: 2,
  province: '北京市',
  city: '北京市',
  county: '北京市',
  en: 'Beijing',
};

AsyncStorage.getItem('Weather', (err, res) => {
  try {
    if (err || !res) throw 0;
    const weather = JSON.parse(res);
    setState({ weather });
  } catch {
    setState({ weather: { cities: [defaultCity] } });
    AsyncStorage.setItem('Weather', JSON.stringify({ cities: [defaultCity] }));
  }
  LayoutAnimation.spring();
  bacthFetchWeather($STATE.weather.cities.map((_, i) => i), $STATE);
});

const WeatherModel = {
  state: {
    searchRes: [defaultCity],
    cities: [],
    weatherData: [],
  } as WeatherState,
  reducers: {
    addCity,
    deleteCity,
    fetchWeather: throttle(fetchWeather, 100, { leading: true }),
    batchFetchWeather: throttle(bacthFetchWeather, 100, { leading: true }),
    searchCity: throttle(async (search: string) => {
      if (!search) return { searchRes: [] };
      const searchRes = searchCity(search);
      return { searchRes };
    }, 200),
  },
};

export default WeatherModel;
