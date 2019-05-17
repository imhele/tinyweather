import {
  createAppContainer,
  NavigationActions,
  NavigationBackActionPayload,
  NavigationContainerComponent,
  NavigationInitActionPayload,
  NavigationNavigateAction,
  NavigationNavigateActionPayload,
  NavigationParams,
  NavigationSetParamsActionPayload,
  StackActions,
} from 'react-navigation';
import Navigator from './pages';

const Container = createAppContainer(Navigator);

const WrappedContainer: React.FC & { ref?: NavigationContainerComponent | null } = ({
  children,
  ...props
}) => (
  <Container {...props} ref={arg => (WrappedContainer.ref = arg)}>
    {children}
  </Container>
);

export function init(options?: NavigationInitActionPayload) {
  if (!WrappedContainer.ref) return;
  return WrappedContainer.ref.dispatch(NavigationActions.init(options));
}

export function navigate(options: NavigationNavigateActionPayload) {
  if (!WrappedContainer.ref) return;
  return WrappedContainer.ref.dispatch(NavigationActions.navigate(options));
}

export function back(options?: NavigationBackActionPayload) {
  if (!WrappedContainer.ref) return;
  return WrappedContainer.ref.dispatch(NavigationActions.back(options));
}

export function setParams(options: NavigationSetParamsActionPayload) {
  if (!WrappedContainer.ref) return;
  return WrappedContainer.ref.dispatch(NavigationActions.setParams(options));
}

export function push(
  routeName: string,
  params?: NavigationParams,
  action?: NavigationNavigateAction,
) {
  if (!WrappedContainer.ref) return;
  return WrappedContainer.ref.dispatch(StackActions.push({ action, routeName, params }));
}

export function replace(
  routeName: string,
  params?: NavigationParams,
  action?: NavigationNavigateAction,
) {
  if (!WrappedContainer.ref) return;
  return WrappedContainer.ref.dispatch(StackActions.replace({ action, routeName, params }));
}

export { NavigationActions };

export default WrappedContainer;
