import zhCN from '@/locales/zh-CN';
import reload from '@/components/reload';
import template from 'lodash/template';
import DeviceInfo from 'react-native-device-info';
import { DEFAULT, LocaleType, locales } from './consts';

export * from './consts';

export function getDeviceLocale(): LocaleType {
  const locale = DeviceInfo.getDeviceLocale();
  const res = Object.entries(locales).find(l => l[1].match(locale)) as [LocaleType, any];
  return res ? res[0] : 'en-US';
}

type Format = (<T = string>(
  id: keyof typeof zhCN,
  values?: { [k: string]: string },
) => T | string) & { locale: LocaleType };

export const format: Format = (id, values) => {
  let msg = locales[format.locale].locale[id] as any;
  if (msg === void 0) {
    if (__DEV__) {
      console.error(`[intl] Get locale text of \`${id}\` failed.`);
    }
    return id;
  }
  msg = msg === DEFAULT ? id : msg;
  return values ? template(msg)(values) : msg;
};

format.locale = getDeviceLocale();

export function getLocale() {
  return format.locale;
}

export function setLocale(locale: LocaleType, cbk?: () => void) {
  // TODO: Persistence
  format.locale = locale;
  reload(cbk);
}

export default format;
