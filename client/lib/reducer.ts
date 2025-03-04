import { createSlice } from '@reduxjs/toolkit';
import { Action, Dosage, TypeObj } from '../../types';
import { CombinedDosagesObj, DosageState } from '../types';
import { calculateReducedValue } from './utils';

const dosagesSlice = createSlice({
  name: 'dosages',
  initialState: {
    dosages: [],
    combinedDosagesObj: {},
    typeObj: {},
  } as DosageState,
  reducers: {
    addDosageSendServer: (state, action: Action<Dosage>) => {
      const dosage = action.payload;

      state.dosages.push(dosage);
      state.dosages.sort((a, b) => b.timestamp - a.timestamp);

      addDosageToCombinedDosagesObj(dosage, state.combinedDosagesObj,
                                    state.typeObj[dosage.typeId].halfLife);
    },
    deleteDosageSendServer: (state, action: Action<string>) => {
      const id = action.payload;

      state.dosages = state.dosages.filter(d => d.id !== id);

      const type = state.typeObj[state.currentTypeId];
      const filteredDosages = state.dosages.filter(d => d.typeId === type.id);
      state.combinedDosagesObj = getCombinedDosagesObj(filteredDosages, type.halfLife);
    },
    initSet: (state, action: Action<[Dosage[], TypeObj]>) => {
      const [dosages, typeObj] = action.payload;

      state.dosages = dosages;
      state.typeObj = typeObj;

      const type = Object.values(typeObj).find(t => t.position === 0);
      const filteredDosages = dosages.filter(d => d.typeId === type.id);
      state.combinedDosagesObj = getCombinedDosagesObj(filteredDosages, type.halfLife);
      state.currentTypeId = type.id;
    },
    setDosages: (state, action: Action<Dosage[]>) => {
      const dosages = action.payload;

      state.dosages = dosages;

      const type = state.typeObj[state.currentTypeId];
      const filteredDosages = state.dosages.filter(d => d.typeId === type.id);
      state.combinedDosagesObj = getCombinedDosagesObj(filteredDosages, type.halfLife);
    },
  },
});

export const { addDosageSendServer, deleteDosageSendServer, initSet, setDosages } = dosagesSlice.actions;
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
