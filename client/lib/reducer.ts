import { createSlice } from '@reduxjs/toolkit';
import { Action, Dosage } from '../../types';
import { CombinedDosagesObj, DosageState } from '../types';
import { calculateReducedValue, calculateTimeVals, HALF_LIFE } from './utils';

const MAXIMUM_TIME = 9 * 60 * 60 * 1000;

const dosagesSlice = createSlice({
  name: 'dosages',
  initialState: {
    dosages: [],
    combinedDosagesObj: {},
  } as DosageState,
  reducers: {
    addDosageSendServer: (state, action: Action<Dosage>) => {
      const dosage = action.payload;
      setCurrentAmount(Date.now())(dosage);
      setTimeValues(dosage);
      state.dosages.push(dosage);
      state.dosages.sort((a, b) => b.timestamp - a.timestamp);
    },
    deleteDosageSendServer: (state, action: Action<string>) => {
      const id = action.payload;
      state.dosages = state.dosages.filter(d => d.id !== id);
    },
    setDosages: (state, action: Action<Dosage[]>) => {
      const newDosages = action.payload;
      const now = Date.now();
      newDosages.forEach(setCurrentAmount(now));
      newDosages.forEach(setTimeValues);

      state.dosages = newDosages;
      state.combinedDosagesObj = getCombinedDosagesObj(newDosages, HALF_LIFE);
    },
    updateDosageAmounts: (state, action: Action<null>) => {
      const now = Date.now();
      state.dosages.forEach(setCurrentAmount(now));
    },
  },
});

export const { addDosageSendServer, deleteDosageSendServer, setDosages, updateDosageAmounts } = dosagesSlice.actions;
export const dosagesReducer = dosagesSlice.reducer;

const setTimeValues = (dosage: Dosage) => {
  if (Date.now() - dosage.timestamp > MAXIMUM_TIME) dosage.timeValues = [];
  else dosage.timeValues = calculateTimeVals(dosage.amount, dosage.timestamp);
};

const setCurrentAmount = (now: number) => (dosage: Dosage) => {
  if (now - dosage.timestamp > MAXIMUM_TIME) {
    dosage.currentAmount = 0;
    return;
  }

  let val = calculateReducedValue(dosage.amount, now - dosage.timestamp, HALF_LIFE);
  dosage.currentAmount = Math.min(val, dosage.amount);
};

function getCombinedDosagesObj(dosages: Dosage[], halfLife: number): CombinedDosagesObj {
  const combinedDosagesObj: CombinedDosagesObj = {};

  for (let dosage of dosages) {
    const startTime = Date.now() - halfLife * 20;
    if (dosage.timestamp < startTime) continue

    addDosageToCombinedDosagesObj(dosage, combinedDosagesObj, halfLife);
  }

  return combinedDosagesObj;
}

function addDosageToCombinedDosagesObj(dosage: Dosage, combinedDosagesObj: CombinedDosagesObj, halfLife: number) {
  let timestamp = dosage.timestamp - (dosage.timestamp % 60000);
  let times = 0

  while (times < 100000) {
    times++;

    const amount = calculateReducedValue(dosage.amount, Math.max(timestamp - dosage.timestamp, 0), halfLife);
    let combinedDosage = combinedDosagesObj[timestamp];
    if (!combinedDosage) combinedDosagesObj[timestamp] = combinedDosage = { timestamp, 'amount-total': 0 };

    combinedDosage[`amount-${dosage.id}`] = amount;
    combinedDosage['amount-total'] += amount;

    if (amount < 0.001) times = Number.MAX_VALUE;
    else timestamp += 5000;
  }
}

function removeDosageFromCombinedDosagesObj(id: string, combinedDosagesObj: CombinedDosagesObj) {

}
