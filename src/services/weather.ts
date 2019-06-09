import intl from '@/components/intl';
import config from '@/config';
import Toast from '@ant-design/react-native/es/toast';
// import throttle from 'lodash/throttle';
import Cities from './cities';

export interface City {
  id: number;
  province: string;
  city: string;
  county: string;
  en: string;
}

// export const searchCity = throttle((search: string) => {
//   return fetch(`${config.ApiPrefix}/weather/city/${search}`, { method: 'POST' })
//     .then(resp => resp.json())
//     .catch(() => Toast.offline(intl('网络请求失败')) && null)
//     .then(res => res || []) as Promise<City[]>;
// }, 2000);

export const searchCity = (search: string) => {
  const result: City[] = [];
  for (const city of Cities) {
    if (!(city as string[])[5].includes(search)) continue;
    result.push({
      id: city[0],
      province: city[1],
      city: city[2],
      county: city[3],
      en: city[4],
    } as City);
    if (result.length > 10) break;
  }
  return result;
};

export interface Forecast {
  /**
   * 白天天气
   */
  conditionDay: string;
  /**
   * 白天天气 id
   */
  conditionIdDay: string;
  /**
   * 夜间天气
   */
  conditionNight: string;
  /**
   * 夜间天气 id
   */
  conditionIdNight: string;
  /**
   * 湿度
   */
  humidity: string;
  /**
   * 预报日期
   */
  predictDate: string;
  /**
   * 白天温度
   */
  tempDay: string;
  /**
   * 夜间温度
   */
  tempNight: string;
  /**
   * 更新时间
   */
  updatetime: string;
  /**
   * 白天风向角度
   */
  windDegreesDay: string;
  /**
   * 夜间风向角度
   */
  windDegreesNight: string;
  /**
   * 白天风向
   */
  windDirDay: string;
  /**
   * 夜间风向
   */
  windDirNight: string;
  /**
   * 白天风级
   */
  windLevelDay: string;
  /**
   * 夜间风级
   */
  windLevelNight: string;
}

export interface Weather {
  timezone: string;
  forecast: Forecast[];
}

export async function getWeather(id: number[]) {
  return fetch(`${config.ApiPrefix}/weather/query/${id.map(i => `${i}`).join('/')}`, {
    method: 'POST',
  })
    .then(resp => resp.json())
    .catch(() => {
      Toast.offline(intl('网络请求失败'));
      // manually refresh after error
      return id.map(() => ({}));
    })
    .then(res => res || null) as Promise<Weather[] | null>;
}
