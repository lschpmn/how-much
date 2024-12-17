
export type Action<T> = {
  payload: T,
  type: string,
};

export type DbSchema = {
  dosages: Dosage[],
};

export type Dosage = {
  amount: number,
  currentAmount?: number,
  id: string,
  timestamp: number,
};

export type EmitAction = (action: Action<any>, reason?: string) => void

export type SocketFunctions = {
  [actionType: string]: (emit: EmitAction) => (p?: any) => void,
};
