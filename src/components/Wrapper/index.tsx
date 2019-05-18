import Hooks, { callHook, registerHook } from '@/components/Hooks';
import { AnyComponentClass } from '@/utils/types';
import React, { FC, useEffect } from 'react';

const Wrapper: FC & {
  queue: AnyComponentClass[];
  didMount: boolean;
} = ({ children, ...props }) => {
  useEffect(() => {
    callHook('onDidMount');
  }, [false]);
  return Wrapper.queue.reduce((prev, Curr: any) => <Curr {...props}>{prev}</Curr>, children as any);
};

Wrapper.didMount = false;
Wrapper.queue = [] as AnyComponentClass[];
registerHook('onDidMount');
Hooks.onDidMount(() => (Wrapper.didMount = true));

export function wrap(component: AnyComponentClass) {
  return Wrapper.queue.unshift(component);
}

export default Wrapper;
