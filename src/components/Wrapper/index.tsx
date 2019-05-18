import { AnyComponentClass } from '@/utils/types';
import React, { FC, useEffect } from 'react';

const Wrapper: FC & {
  queue: AnyComponentClass[];
  didMount: boolean;
  onDidMount: (...cbk: (() => void)[]) => void;
  $onDidMount: (() => void)[];
} = ({ children, ...props }) => {
  useEffect(() => {
    if (Wrapper.didMount) return;
    Wrapper.didMount = true;
    Wrapper.$onDidMount.forEach(cbk => cbk());
  }, [false]);
  return Wrapper.queue.reduce((prev, Curr: any) => <Curr {...props}>{prev}</Curr>, children as any);
};

Wrapper.queue = [] as AnyComponentClass[];
Wrapper.didMount = false;
Wrapper.$onDidMount = [] as (() => void)[];
Wrapper.onDidMount = Wrapper.$onDidMount.push;

export function wrap(component: AnyComponentClass) {
  return Wrapper.queue.unshift(component);
}

export default Wrapper;
