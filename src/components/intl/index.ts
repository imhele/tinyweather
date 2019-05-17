import config from '@/config';
import zhCN from '@/locales/zh-CN';
import template from 'lodash/template';
import DeviceInfo from 'react-native-device-info';
import { LocaleType, locales } from './consts';

export * from './consts';

export function matchLocale(locale?: any): LocaleType {
  if (typeof locale !== 'string') return config.intl.default || 'zh-CN';
  const res = Object.entries(locales).find(l => l[1].match(locale)) as [LocaleType, any];
  return res ? res[0] : config.intl.default || 'zh-CN';
}

export function getDeviceLocale(): LocaleType {
  return matchLocale(DeviceInfo.getDeviceLocale());
}

export function getLocale() {
  return format.locale;
}

type Format = (<T = string>(
  id: keyof typeof zhCN,
  values?: { [k: string]: string },
) => T | string) & { locale: LocaleType };

export const format: Format = (id, values) => {
  let msg: any = locales[format.locale].locale[id];
  if (msg === void 0) {
    if (__DEV__) {
      console.error(`[intl] Get '${format.locale}' locale text of \`${id}\` failed.`);
    }
    return id;
  }
  msg = msg === 0 ? id : msg;
  return values ? template(msg)(values) : msg;
};

format.locale = matchLocale();

export default format;
