import { useRef } from 'react';

export const useChange = <T>(current: T): boolean => {
  const previous = useRef(current);
  if (previous.current === current) return false;
  previous.current = current;
  return true;
};
