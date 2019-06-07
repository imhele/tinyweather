import * as ReactNative from 'react-native';

const { StatusBarManager } = ReactNative.NativeModules;

const FontScale = ReactNative.PixelRatio.getFontScale();
const StatusBarHeight: number = StatusBarManager.HEIGHT || 20;
if (ReactNative.Platform.OS === 'ios')
  StatusBarManager.getHeight((height: number) => {
    PX.Device.StatusBarHeight = height;
    Device.HeightNS = Device.Height - Device.StatusBarHeight;
  });

const Device = {
  HeightNS: 0,
  StatusBarHeight,
  Width: ReactNative.Dimensions.get('window').width,
  Height: ReactNative.Dimensions.get('window').height,
};

const PixelRatio = {
  Default: 2,
  Device: ReactNative.PixelRatio.get(),
  Scaled: 1,
};

Device.HeightNS = Device.Height - Device.StatusBarHeight;
PixelRatio.Scaled = (PixelRatio.Device * PixelRatio.Scaled) / Math.pow(PixelRatio.Default, 2);

const PX: ((size: number) => number) & {
  Device: typeof Device;
  FontScale: typeof FontScale;
  PixelRatio: typeof PixelRatio;
  VW: (percent: number) => number;
  VH: (percent: number) => number;
} = size => Math.floor(size * PixelRatio.Scaled);

PX.Device = Device;
PX.FontScale = FontScale;
PX.PixelRatio = PixelRatio;
PX.VW = (percent: number) => Math.floor((Device.Width * percent) / 100);
PX.VH = (percent: number) => Math.floor((Device.Height * percent) / 100);

export default PX;
