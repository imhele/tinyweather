import Provider from '@ant-design/react-native/es/provider';
import { registerHooks } from '@/components/Hooks';
import { IntlConfig } from '@/components/intl';
import { WrapperConfig } from '@/components/Wrapper';

export { default as Color } from './color';
export { default as PX } from './pixel';

const intl: IntlConfig = {
  default: 'zh-CN',
};

const wrapper: WrapperConfig = {
  default: [Provider],
};

registerHooks('onDidMount', 'onSetLocale');

export default {
  intl,
  wrapper,
};
