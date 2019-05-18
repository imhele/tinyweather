import zhCN from '@/locales/zh-CN';
import enUS from '@/locales/en-US';
import { TemplateExecutor } from 'lodash';

type TemplateCache = { [K in keyof typeof zhCN]?: TemplateExecutor };

export const locales = {
  'zh-CN': {
    data: zhCN,
    match: (s: string) => /zh/.test(s),
    template: {} as TemplateCache,
    upperCase: false,
  },
  'en-US': {
    data: enUS,
    match: (s: string) => /en/.test(s),
    template: {} as TemplateCache,
    upperCase: true,
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
  /**
   * enable persistence func of locale settings
   * @default
   * 'locale'
   */
  storageKey?: string | false;
}
