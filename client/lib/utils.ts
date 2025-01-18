import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const HALF_LIFE = 30 * 60 * 1000;
const TARGET_RATIO = 0.5;

export const calculateReducedValue = (startingAmount: number, timeElapsed: number) =>
  startingAmount * Math.pow(0.5, timeElapsed / HALF_LIFE);

export function constructRemainingStr(currentAmount: number, targetRatio: number=TARGET_RATIO) {
  const ratio = targetRatio / currentAmount;
  const halfLives = Math.log10(ratio) / Math.log10(0.5);
  const time = halfLives * HALF_LIFE;
  const minutes = Math.floor(time / (60 * 1000)) % 60;
  const hours = Math.floor(time / (60 * 60 * 1000));
  let returnStr = ' ';

  hours && (returnStr += `${hours}h `);
  minutes && (returnStr += `${minutes}m `);
  (hours === 0 && minutes === 0) && (returnStr += 'a few seconds ');

  return returnStr + 'remaining';
}

export const getRndStr = (): string => Math.random().toString(36).slice(-8);

export const setGraphTimes = (amount: number, timestamp: number) => {
  const startTime = Math.floor(timestamp / 1000) * 1000;
  const timesArray: { timestamp: number, amount: number }[] = [];
  timesArray.push({
    amount,
    timestamp: startTime,
  });

  let times = 0;
  let currentTimestamp = startTime;
  while(times < 10000) {
    currentTimestamp += 60 * 1000;
    const currentAmount = calculateReducedValue(amount, currentTimestamp - startTime);
    if (currentAmount < 1) times = Number.MAX_VALUE;
    else times++;

    timesArray.push({
      amount: currentAmount,
      timestamp: currentTimestamp,
    });
  }

  return timesArray;
};

export const useAction = <T extends Function>(action: T, deps?): T => {
  const dispatch = useDispatch();

  return useCallback((...args) =>
    dispatch(action(...args)), deps ? [dispatch, ...deps] : [dispatch]) as any;
};
