import { createSlice } from '@reduxjs/toolkit';
import { Action } from '../../types';
import { Dosage } from '../types';


const dosagesSlice = createSlice({
  name: 'dosages',
  initialState: [] as Dosage[],
  reducers: {
    addDosage: (state, action: Action<Dosage>) => {
      state.push(action.payload);
    },
  },
});

export const { addDosage } = dosagesSlice.actions;
export const dosagesReducer = dosagesSlice.reducer;