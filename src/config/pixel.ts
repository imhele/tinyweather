import * as ReactNative from 'react-native';

const FontScale = ReactNative.PixelRatio.getFontScale();

const Device = {
  Width: ReactNative.Dimensions.get('window').width,
  Height: ReactNative.Dimensions.get('window').height,
};

const PixelRatio = {
  Default: 2,
  Device: ReactNative.PixelRatio.get(),
  Scaled: 1,
};

PixelRatio.Scaled = (PixelRatio.Device * PixelRatio.Scaled) / PixelRatio.Default;

const PX: ((size: number) => number) & {
  Device: typeof Device;
  FontScale: typeof FontScale;
  PixelRatio: typeof PixelRatio;
  VW: (percent: number) => number;
  VH: (percent: number) => number;
} = size => Math.round(size * PixelRatio.Scaled + 0.5);

PX.Device = Device;
PX.FontScale = FontScale;
PX.PixelRatio = PixelRatio;
PX.VW = (percent: number) => Math.round((Device.Width * percent) / 100 + 0.5);
PX.VH = (percent: number) => Math.round((Device.Height * percent) / 100 + 0.5);

export default PX;
