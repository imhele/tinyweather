import config from '@/config';
import { AnyComponentClass } from '@/utils/types';
import React, { FC } from 'react';

export interface WrapperConfig {
  default?: AnyComponentClass[];
}

const Wrapper: FC & {
  queue: AnyComponentClass[];
} = ({ children, ...props }) =>
  Wrapper.queue.reduce((prev, Curr: any) => <Curr {...props}>{prev}</Curr>, children as any);

Wrapper.queue = config.wrapper.default || ([] as AnyComponentClass[]);

export function wrap(component: AnyComponentClass) {
  return Wrapper.queue.unshift(component);
}

export default Wrapper;
