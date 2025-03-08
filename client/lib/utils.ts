import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const TARGET_RATIO = 1;

export const calculateReducedValue = (startingAmount: number, timeElapsed: number, halfLife: number) =>
  startingAmount * Math.pow(0.5, timeElapsed / halfLife);

export function constructRemainingStr(currentAmount: number, halfLife: number, targetRatio: number=TARGET_RATIO) {
  const ratio = targetRatio / currentAmount;
  const halfLives = Math.log10(ratio) / Math.log10(0.5);
  const time = halfLives * halfLife;
  const minutes = Math.floor(time / (60 * 1000)) % 60;
  const hours = Math.floor(time / (60 * 60 * 1000));
  let returnStr = ' ';

  hours && (returnStr += `${hours}h `);
  minutes && (returnStr += `${minutes}m `);
  (hours === 0 && minutes === 0) && (returnStr += 'a few seconds ');

  return returnStr + 'remaining';
}

export const getNowMinute = (): number => {
  const now = Date.now();
  return now - (now % 60000);
};

export const getRndStr = (): string => Math.random().toString(36).slice(-8);

export const getStepTime = (halfLife: number) => {
  if (halfLife > 2 * 60 * 60 * 1000) return 60 * 1000;
  else return 5 * 1000;
};

export const useAction = <T extends Function>(action: T, deps?): T => {
  const dispatch = useDispatch();

  return useCallback((...args) =>
    dispatch(action(...args)), deps ? [dispatch, ...deps] : [dispatch]) as any;
};

export const useNow = (halfLife: number): [now: number, updateNow: () => void] => {
  const [now, setNow] = useState(getNowMinute);

  const updateNow = () => {
    const now = Date.now()
    setNow(now - (now % getStepTime(halfLife)));
  };

  useEffect(updateNow, [halfLife]);

  return [now, updateNow];
};
