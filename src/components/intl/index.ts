import zhCN from '@/locales/zh-CN';
import enUS from '@/locales/en-US';
import { DEFAULT } from './consts';

export * from './consts';

export default <T = string>(id: keyof typeof zhCN): T | string => {
  const msg = zhCN[id] as any;
  if (msg === void 0) {
    if (__DEV__) {
      console.error(`[intl] Get locale text of \`${id}\` failed.`);
    }
    return id;
  }
  if (typeof msg === 'string') {
    return msg;
  }
  return msg === DEFAULT ? id : msg;
};
