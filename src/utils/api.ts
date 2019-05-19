import { StatusBar, StatusBarAnimation } from 'react-native';

export function hideStatusBar(animation: StatusBarAnimation = 'fade') {
  StatusBar.setHidden(true, animation);
}

export function showStatusBar(animation: StatusBarAnimation = 'fade') {
  StatusBar.setHidden(false, animation);
}
