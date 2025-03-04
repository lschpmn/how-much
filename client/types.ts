import { Dosage, TypeObj } from '../types';

export type DosageState = {
  combinedDosagesObj: CombinedDosagesObj,
  currentTypeId: string,
  dosages: Dosage[],
  typeObj: TypeObj,
};

export type State = {
  dosages: DosageState,
};

export type CombinedDosage = { timestamp: number } & { [key in `amount-${string}`]: number };

export type CombinedDosagesObj = { [timestamp: number]: CombinedDosage };