import { createSlice } from '@reduxjs/toolkit';
import { Action, Dosage, TypesObj } from '../../types';
import { CombinedDosagesObj, DosageState } from '../types';
import { calculateReducedValue, getNowMinute, getStepTime } from './utils';

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

      updateStateCombinedDosagesObj(state);
    },
    deleteDosageSendServer: (state, action: Action<string>) => {
      const id = action.payload;

      state.dosages = state.dosages.filter(d => d.id !== id);

      updateStateCombinedDosagesObj(state);
    },
    initSet: (state, action: Action<[Dosage[], TypesObj]>) => {
      const [dosages, typeObj] = action.payload;

      state.dosages = dosages;
      state.typeObj = typeObj;

      state.currentTypeId = getTypeFromUrl() || Object.values(typeObj).find(t => t.position === 0).id;
      updateStateCombinedDosagesObj(state);
    },
    setCurrentDosageId: (state, action: Action<string>) => {
      state.currentTypeId = action.payload;

      setTypeToUrl(action.payload);
      updateStateCombinedDosagesObj(state);
    },
    setDosages: (state, action: Action<Dosage[]>) => {
      state.dosages = action.payload;

      updateStateCombinedDosagesObj(state);
    },
  },
});

export const {
  addDosageSendServer,
  deleteDosageSendServer,
  initSet,
  setCurrentDosageId,
  setDosages,
} = dosagesSlice.actions;

export const dosagesReducer = dosagesSlice.reducer;

function updateStateCombinedDosagesObj(state: DosageState) {
  const type = state.typeObj[state.currentTypeId];
  const filteredDosages = state.dosages.filter(d => d.typeId === type.id);
  state.combinedDosagesObj = getCombinedDosagesObj(filteredDosages, type.halfLife);
}

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
  let timestamp = getNowMinute();
  let times = 0

  if (calculateReducedValue(dosage.amount, timestamp - dosage.timestamp, halfLife) < 0.01) return;

  while (times < 100000) {
    times++;

    const amount = calculateReducedValue(dosage.amount, Math.max(timestamp - dosage.timestamp, 0), halfLife);
    let combinedDosage = combinedDosagesObj[timestamp];
    if (!combinedDosage) combinedDosagesObj[timestamp] = combinedDosage = { timestamp, 'amount-total': 0 };

    combinedDosage[`amount-${dosage.id}`] = amount;
    combinedDosage['amount-total'] += amount;

    if (amount < 0.01) times = Number.MAX_VALUE;
    else timestamp += getStepTime(halfLife);
  }
}

const getTypeFromUrl = (): string | null => {
  const url = new URL(window.location.toString());
  return url.searchParams.get('type');
};

const setTypeToUrl = (typeId: string) => {
  const url = new URL(window.location.toString());
  url.searchParams.set('type', typeId);
  history.replaceState(null, '', url);
};