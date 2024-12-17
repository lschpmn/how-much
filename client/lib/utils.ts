import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const getRndStr = (): string => Math.random().toString(36).slice(-8);

export const useAction = <T extends Function>(action: T, deps?): T => {
  const dispatch = useDispatch();

  return useCallback((...args) =>
    dispatch(action(...args)), deps ? [dispatch, ...deps] : [dispatch]) as any;
};
