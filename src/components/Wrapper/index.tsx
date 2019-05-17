import { AnyComponentClass } from '@/utils/types';
import React, { FC } from 'react';

const Wrapper: FC & { queue: AnyComponentClass[] } = ({ children, ...props }) =>
  Wrapper.queue.reduce((prev, Curr: any) => <Curr {...props}>{prev}</Curr>, children as any);

Wrapper.queue = [] as AnyComponentClass[];

export function wrap(component: AnyComponentClass) {
  return Wrapper.queue.unshift(component);
}

export default Wrapper;
