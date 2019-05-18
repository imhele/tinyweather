import Provider from '@ant-design/react-native/es/provider';
import { registerHooks } from '@/components/Hooks';
import { IntlConfig } from '@/components/intl';
import { WrapperConfig } from '@/components/Wrapper';

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
