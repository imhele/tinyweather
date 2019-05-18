import Wrapper from '@/components/Wrapper';
import config from '@/config';
import zhCN from '@/locales/zh-CN';
import Portal from '@ant-design/react-native/es/portal';
import Toast from '@ant-design/react-native/es/toast';
import template from 'lodash/template';
import { AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { IdAsMsg, locales, LocaleType } from './consts';

export * from './consts';

export function matchLocale(localeName?: any, defaultValue: LocaleType = 'zh-CN'): LocaleType {
  if (typeof localeName !== 'string') return defaultValue;
  const res = Object.entries(locales).find(l => l[1].match(localeName)) as [LocaleType, any];
  return res ? res[0] : defaultValue;
}

export function getDeviceLocale(): LocaleType {
  return matchLocale(DeviceInfo.getDeviceLocale());
}

export function getLocale(): LocaleType {
  return format.localeName;
}

export function setLocale(localeName: LocaleType) {
  const toastKey = Toast.loading(upper('正在设置语言'));
  AsyncStorage.setItem('locale', localeName, err => {
    Portal.remove(toastKey);
    if (err) return Toast.fail(upper('设置语言失败'));
  });
}

type FormatText = (id: keyof typeof zhCN, values?: { [k: string]: any }) => string;

interface Format<T = string> {
  (id: keyof typeof zhCN, values?: { [k: string]: any }): T | string;
  localeName: LocaleType;
  upper: FormatText;
  upperAll: FormatText;
}

export const format: Format = (id, values) => {
  const locale = locales[format.localeName];
  let message: any = locale.data[id];
  // get locale text failed
  if (message === void 0) {
    if (__DEV__) {
      console.error(`[intl] Get '${format.localeName}' locale text of \`${id}\` failed.`);
    }
    return id;
  }
  // use id as fomatted message
  if (message === IdAsMsg) {
    message = id;
  }
  // format template
  if (values) {
    // cache template executor
    if (!locale.template[id]) {
      locale.template[id] = template(message);
    }
    message = locale.template[id]!(values);
  }
  return message;
};

export const upper: FormatText = (id, value) => {
  const locale = locales[format.localeName];
  const message = format(id, value);
  if (!locale.upperCase || typeof message !== 'string' || !message.length) {
    return message;
  }
  return `${message[0].toUpperCase()}${message.slice(1)}`;
};

export const upperAll: FormatText = (id, value) => {
  const locale = locales[format.localeName];
  const message = format(id, value);
  if (!locale.upperCase || typeof message !== 'string') {
    return message;
  }
  return message.toUpperCase();
};

/**
 ** *****************
 ** INIT `intl` START
 ** *****************
 */
format.upper = upper;
format.upperAll = upperAll;
format.localeName = matchLocale(null, config.intl.default);
const { deviceInfo = true } = config.intl;
if (deviceInfo) {
  Wrapper.onDidMount(() =>
    AsyncStorage.getItem('locale', (err, res) => {
      if (err) return;
    }),
  );
}
/**
 ** ***************
 ** INIT `intl` END
 ** ***************
 */

export default format;
