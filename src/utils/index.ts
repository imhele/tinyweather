export * from './api';
import { FlexStyle, StyleProp } from 'react-native';

export function mixStyle<S extends object = any>(
  style: S,
  obj: { [K in keyof S]?: boolean },
  ...args: any[]
): StyleProp<any> {
  return Object.keys(obj)
    .filter(k => obj[k as keyof S])
    .map(k => style[k as keyof S])
    .concat(args) as any;
}
