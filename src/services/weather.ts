import intl from '@/components/intl';
import config from '@/config';
import Toast from '@ant-design/react-native/es/toast';

export interface City {
  id: number;
  province: string;
  city: string;
  county: string;
  en: string;
}

export async function searchCity(id: number) {
  return fetch(`${config.ApiPrefix}/weather/city/${id}`)
    .then(resp => resp.json())
    .catch(() => Toast.offline(intl('网络请求失败')))
    .then(res => res || []) as Promise<City[]>;
}

export interface Weather {}

export async function getWeather(id: number) {
  return fetch(`${config.ApiPrefix}/weather/query/${id}`)
    .then(resp => resp.json())
    .catch(() => Toast.offline(intl('网络请求失败')))
    .then(res => res || null) as Promise<Weather | null>;
}
