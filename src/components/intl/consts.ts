import zhCN from '@/locales/zh-CN';
import enUS from '@/locales/en-US';

export const DEFAULT: symbol = Symbol('default');

export const UpperCaseLang: LocaleType[] = ['en-US'];

export const locales = {
  'zn-CN': {
    match: (s: string) => /zh/.test(s),
    locale: zhCN,
  },
  'en-US': {
    match: (s: string) => /en/.test(s),
    locale: enUS,
  },
};

export type LocaleType = keyof typeof locales;
