import Provider from '@ant-design/react-native/es/provider';
import { registerHooks } from '@/components/Hooks';
import { IntlConfig } from '@/components/intl';
import { WrapperConfig } from '@/components/Wrapper';
import { UIManager } from 'react-native';

UIManager.setLayoutAnimationEnabledExperimental(true);

export { default as Color } from './color';
export { default as Font } from './font';
export { default as PX } from './pixel';
export { default as Ratio } from './ratio';

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
  ApiPrefix: 'https://1704858712026921.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/Temp',
};
