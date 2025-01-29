import { Dosage } from '../types';

export type State = {
  dosages: Dosage[],
};

export type ZippedDosage = { timestamp: number } & { [key in `amount-${string}`]: number };
