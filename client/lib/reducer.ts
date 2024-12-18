import { createSlice } from '@reduxjs/toolkit';
import { Action, Dosage } from '../../types';

const MAXIMUM_TIME = 6 * 60 * 60 * 1000;

const dosagesSlice = createSlice({
  name: 'dosages',
  initialState: [] as Dosage[],
  reducers: {
    addDosageSendServer: (state, action: Action<Dosage>) => {
      state.push(action.payload);
      state.sort((a, b) => b.timestamp - a.timestamp);
    },
    deleteDosageSendServer: (state, action: Action<string>) => {
      const id = action.payload;
      return state.filter(d => d.id !== id);
    },
    setDosages: (state, action: Action<Dosage[]>) => {
      const newState = action.payload;
      newState.forEach(dosage => {
        const oldDosage = state.find(d => d.id === dosage.id);
        if (oldDosage) dosage.currentAmount = oldDosage.currentAmount;
      });

      return newState;
    },
    updateDosageAmounts: (state, action: Action<null>) => {
      const now = Date.now();
      state.forEach(dosage => {
        if (now - dosage.timestamp > MAXIMUM_TIME) {
          dosage.currentAmount = 0;
          return;
        }

        let val = dosage.amount * Math.pow(0.5, (Date.now() - dosage.timestamp) / (30 * 60 * 1000));
        dosage.currentAmount = Math.min(val, dosage.amount);
      });
    },
  },
});

export const { addDosageSendServer, deleteDosageSendServer, setDosages, updateDosageAmounts } = dosagesSlice.actions;
export const dosagesReducer = dosagesSlice.reducer;
