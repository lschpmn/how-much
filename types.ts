
export type Action<T> = {
  payload: T,
  type: string,
};

export type DbSchema = {
  dosages: Dosage[],
  typeObj: TypeObj,
};

export type Dosage = {
  amount: number,
  id: string,
  timestamp: number,
  typeId: string,
};

export type EmitAction = (action: Action<any>, reason?: string) => void

export type Preset = {
  amount: number,
  name: string,
};

export type SocketFunctions = {
  [actionType: string]: (emit: EmitAction, emitAll: EmitAction) => (p?: any) => void,
};

export type Type = {
  id: string,
  halfLife: number,
  name: string,
  position: number,
};

export type TypeObj = { [id: string]: Type };
