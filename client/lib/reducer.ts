import { createSlice } from '@reduxjs/toolkit';
import { Action, Dosage } from '../../types';
import { CombinedDosagesObj, DosageState } from '../types';
import { calculateReducedValue, HALF_LIFE } from './utils';

const dosagesSlice = createSlice({
  name: 'dosages',
  initialState: {
    dosages: [],
    combinedDosagesObj: {},
  } as DosageState,
  reducers: {
    addDosageSendServer: (state, action: Action<Dosage>) => {
      const dosage = action.payload;

      state.dosages.push(dosage);
      state.dosages.sort((a, b) => b.timestamp - a.timestamp);

      addDosageToCombinedDosagesObj(dosage, state.combinedDosagesObj, HALF_LIFE);
    },
    deleteDosageSendServer: (state, action: Action<string>) => {
      const id = action.payload;

      state.dosages = state.dosages.filter(d => d.id !== id);
      state.combinedDosagesObj = getCombinedDosagesObj(state.dosages, HALF_LIFE);
    },
    setDosages: (state, action: Action<Dosage[]>) => {
      const newDosages = action.payload;

      state.dosages = newDosages;
      state.combinedDosagesObj = getCombinedDosagesObj(newDosages, HALF_LIFE);
    },
  },
});

export const { addDosageSendServer, deleteDosageSendServer, setDosages } = dosagesSlice.actions;
export const dosagesReducer = dosagesSlice.reducer;

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

    if (amount < 0.01) times = Number.MAX_VALUE;
    else timestamp += 5000;
  }
}
