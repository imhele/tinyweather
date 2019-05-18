import zhCN from '@/locales/zh-CN';
import enUSLang from '@/locales/en-US/lang';
import enUSMine from '@/locales/en-US/mine';

const enUS: typeof zhCN = {
  ...enUSLang,
  ...enUSMine,
  挑食: 'chosyeat',
};

export default enUS;
