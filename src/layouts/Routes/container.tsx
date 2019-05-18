import Hooks, { callHook } from '@/components/Hooks';
import React, { useEffect } from 'react';
import { createAppContainer, NavigationContainerComponent } from 'react-navigation';
import Navigator from './pages';

const Container = createAppContainer(Navigator);
Hooks.onDidMount(() => (WrappedContainer.didMount = true));

export const WrappedContainer: React.FC & {
  didMount?: boolean;
  ref?: NavigationContainerComponent | null;
} = ({ children, ...props }) => {
  useEffect(() => {
    if (WrappedContainer.didMount) return;
    callHook('onDidMount');
  }, [false]);

  return (
    <Container {...props} ref={arg => (WrappedContainer.ref = arg)}>
      {children}
    </Container>
  );
};
