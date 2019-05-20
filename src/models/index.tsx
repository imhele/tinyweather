import { wrap } from '@/components/Wrapper';
import { AnyComponentClass, Omit, PowerPartial } from '@/utils/types';
import merge from 'lodash/merge';
import throttle from 'lodash/throttle';
import React, { createContext, Dispatch, FC, SetStateAction, useContext, useState } from 'react';
import global from './global';
import home from './home';

/**
 ** *****
 ** STATE
 ** *****
 */
type Loading<T> = { [K in keyof T | 'model']: boolean };
export const initialState = {
  $init: false,
  global: global.state,
  home: home.state,
  $loading: {
    global: { model: false } as Loading<typeof global.reducers>,
    home: { model: false } as Loading<typeof home.reducers>,
  },
};
export const $STATE = initialState;
export type State = typeof initialState;
export const StateContext = createContext(initialState);
export const setState = (
  nextState?: PowerPartial<State> | ((state: State) => PowerPartial<State>),
) => {
  if (typeof nextState === 'function') {
    nextState = nextState($STATE);
  }
  if (!nextState) return;
  dispatch.$setState({ ...merge($STATE, nextState) });
};

/**
 ** ********
 ** DISPATCH
 ** ********
 */
function wrapReducers(namespace: string, reducers: any) {
  const wrappedReducers: any = {};
  Object.keys(reducers).forEach(key => {
    wrappedReducers[key] = async function(payload: any) {
      dispatch.setState({ $loading: { [namespace]: { [key]: true, model: true } } });
      const nextState = await reducers[key](payload, $STATE);
      const $loading = $STATE.$loading as any;
      if (!$loading[namespace]) return;
      const model = Object.entries($loading[namespace]).some(a => a[1] && a[0] !== key);
      return dispatch.setState({
        [namespace]: nextState || {},
        $loading: { [namespace]: { [key]: false, model } },
      });
    };
  });
  return wrappedReducers;
}

export const dispatch = {
  setState,
  global: global.reducers,
  home: home.reducers,
  $setState: (() => {}) as Dispatch<SetStateAction<State>>,
};

Object.keys(dispatch)
  .filter(key => key[0] !== '$' && key !== 'setState')
  .forEach(key => {
    (dispatch as any)[key] = wrapReducers(key, (dispatch as any)[key]);
  });

/**
 ** *********
 ** CONTAINER
 ** *********
 */
export const Container: FC = ({ children }) => {
  const [state, $setState] = useState(initialState);
  if (!$STATE.$init) {
    dispatch.setState({ $init: true });
    dispatch.$setState = throttle($setState, 100);
  }
  return <StateContext.Provider value={state}>{children}</StateContext.Provider>;
};

wrap(Container);

/**
 ** *******
 ** CONNECT
 ** *******
 */
type Connect = <S>(
  f: (state: State) => S,
) => <P>(c: AnyComponentClass<any>) => FC<Omit<P, 'dispatch' | keyof S>>;

export const connect: Connect = mapFunc => Component => {
  const Wrapped: FC = ({ children, ...props }) => (
    <Component {...props} {...mapFunc(useContext(StateContext))} dispatch={dispatch}>
      {children}
    </Component>
  );
  return Object.assign(Wrapped, Component);
};

export default connect;
