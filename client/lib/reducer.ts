import { createSlice } from '@reduxjs/toolkit';
import { Action, Dosage } from '../../types';
import { DosageState } from '../types';
import { calculateReducedValue, calculateTimeVals } from './utils';

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

  let val = calculateReducedValue(dosage.amount, now - dosage.timestamp);
  dosage.currentAmount = Math.min(val, dosage.amount);
};