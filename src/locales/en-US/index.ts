import zhCN from '@/locales/zh-CN';
import Lang from './lang';
import Tip from './tip';
import Word from './word';

const enUS: typeof zhCN = {
  ...Lang,
  ...Tip,
  ...Word,
};

export default enUS;
