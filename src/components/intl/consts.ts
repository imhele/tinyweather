import zhCN from '@/locales/zh-CN';
import enUS from '@/locales/en-US';

export const UpperCaseLang: LocaleType[] = ['en-US'];

export const locales = {
  'zh-CN': {
    match: (s: string) => /zh/.test(s),
    locale: zhCN,
  },
  'en-US': {
    match: (s: string) => /en/.test(s),
    locale: enUS,
  },
};

export type LocaleType = keyof typeof locales;

export interface IntlConfig {
  /**
   * default locale
   * @default
   * zh-CN
   */
  default?: LocaleType;
  /**
   * set locale from device info after mount
   * @default
   * true
   */
  deviceInfo?: boolean;
}
