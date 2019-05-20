import { ImageURISource } from 'react-native';

export interface Banner {
  key: string | number;
  source: ImageURISource;
}

export interface HomeState {
  banners: Banner[];
}

const refresh = () => {
  return new Promise(resolver => setTimeout(resolver, 2000));
};

const testURI = [
  'https://p1.meituan.net/display/679be531c92513b6170a8166f125c732115167.jpg',
  'https://img.meituan.net/midas/d612a0f17a2377eac408b84f54f2d7ef98038.jpg',
];

const home = {
  state: {
    banners: testURI.map((uri, key): Banner => ({ source: { uri }, key })),
  } as HomeState,
  reducers: {
    refresh,
  },
};

export default home;
