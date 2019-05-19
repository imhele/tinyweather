import zhCN from '@/locales/zh-CN';
import Lang from './lang';
import Mine from './mine';
import Word from './word';

const enUS: typeof zhCN = {
  ...Lang,
  ...Mine,
  ...Word,
  挑食: 'chosyeat',
};

export default enUS;
