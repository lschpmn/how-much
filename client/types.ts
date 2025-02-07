import { Dosage } from '../types';

export type State = {
  dosages: Dosage[],
};

export type CombinedDosage = { timestamp: number } & { [key in `amount-${string}`]: number };
