import { createSlice } from '@reduxjs/toolkit';
import { Action, Dosage } from '../../types';
import { calculateReducedValue, calculateTimeVals } from './utils';

const MAXIMUM_TIME = 6 * 60 * 60 * 1000;

const dosagesSlice = createSlice({
  name: 'dosages',
  initialState: [] as Dosage[],
  reducers: {
    addDosageSendServer: (state, action: Action<Dosage>) => {
      const dosage = action.payload;
      setCurrentAmount(Date.now())(dosage);
      setTimeValues(dosage);
      state.push(dosage);
      state.sort((a, b) => b.timestamp - a.timestamp);
    },
    deleteDosageSendServer: (state, action: Action<string>) => {
      const id = action.payload;
      return state.filter(d => d.id !== id);
    },
    setDosages: (state, action: Action<Dosage[]>) => {
      const newState = action.payload;
      const now = Date.now();
      newState.forEach(setCurrentAmount(now));
      newState.forEach(setTimeValues);

      return newState;
    },
    updateDosageAmounts: (state, action: Action<null>) => {
      const now = Date.now();
      state.forEach(setCurrentAmount(now));
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