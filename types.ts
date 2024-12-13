
export type Action<T> = {
  payload: T,
  type: string,
};

export type DbSchema = {

};

export type EmitAction = (action: Action<any>, reason?: string) => void

export type SocketFunction = {
  [actionType: string]: (emit: EmitAction) => (p?: any) => void
};
