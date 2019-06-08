import { City, getWeather, searchCity, Weather } from '@/services/weather';
import { PowerPartial } from '@/utils/types';
import throttle from 'lodash/throttle';
import { AsyncStorage, LayoutAnimation } from 'react-native';
import { setState } from './index';

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

const deleteCity = (index: number, state?: any) => {
  const weather: WeatherState = state.weather;
  const { cities } = weather;
  cities.splice(index, 1);
  persist({ cities }, weather);
  return { cities: [...cities] };
};

const addCity = (index: number, state: any) => {
  const weather: WeatherState = state.weather;
  if (!weather.searchRes[index]) return null;
  const cities = weather.cities.concat(weather.searchRes[index]);
  persist({ cities }, weather);
  return { searchRes: [], cities };
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
});

const WeatherModel = {
  state: {
    searchRes: [],
    cities: [],
    weatherData: [],
  } as WeatherState,
  reducers: {
    addCity,
    deleteCity,
    fetchWeather: throttle(fetchWeather, 100),
    batchFetchWeather: throttle(bacthFetchWeather, 100),
  },
};

export default WeatherModel;
