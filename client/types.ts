import { Dosage } from '../types';

export type DosageState = {
  dosages: Dosage[],
  combinedDosagesObj: CombinedDosagesObj,
};

export type State = {
  dosages: DosageState,
};

export type CombinedDosage = { timestamp: number } & { [key in `amount-${string}`]: number };

export type CombinedDosagesObj = { [timestamp: number]: CombinedDosage };