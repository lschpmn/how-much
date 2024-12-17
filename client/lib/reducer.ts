import { createSlice } from '@reduxjs/toolkit';
import { Action, Dosage } from '../../types';


const dosagesSlice = createSlice({
  name: 'dosages',
  initialState: [] as Dosage[],
  reducers: {
    addDosageSendServer: (state, action: Action<Dosage>) => {
      state.push(action.payload);
      state.sort((a, b) => b.timestamp - a.timestamp);
    },
    setDosages: (state, action: Action<Dosage[]>) => {
      return action.payload;
    },
    updateDosageAmounts: (state, action: Action<null>) => {
      state.forEach(dosage => {
        let val = dosage.amount * Math.pow(0.5, (Date.now() - dosage.timestamp) / (30 * 60 * 1000));
        val = Math.round(val * 100) / 100;
        dosage.currentAmount = Math.min(val, dosage.amount);
      });
    },
  },
});

export const { addDosageSendServer, setDosages, updateDosageAmounts } = dosagesSlice.actions;
export const dosagesReducer = dosagesSlice.reducer;
