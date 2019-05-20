import zhCN from '@/locales/zh-CN';
import Lang from './lang';
import Mine from './mine';
import Word from './word';

const enUS: typeof zhCN = {
  ...Lang,
  ...Mine,
  ...Word,
  挑食: 'chosyeat',
  SLOGAN: 'your nutrition specialist',
  'toolbar-0': 'Staple food',
  'toolbar-1': 'Nearby',
  'toolbar-2': 'Soup&Drink',
  'toolbar-3': 'Snack',
};

export default enUS;
