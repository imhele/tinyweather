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
} = size => Math.round(size * PixelRatio.Scaled + 0.5);

PX.Device = Device;
PX.FontScale = FontScale;
PX.PixelRatio = PixelRatio;

export default PX;
