import Provider from '@ant-design/react-native/es/provider';
import { AppRegistry } from 'react-native';
import App from './src/pages';
import { name as appName } from './app.json';

const Wrapper = props => (
  <Provider>
    <App {...props} />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Wrapper);
