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
  },
});

export const { addDosageSendServer, setDosages } = dosagesSlice.actions;
export const dosagesReducer = dosagesSlice.reducer;