import { addDosageSendServer, deleteDosageSendServer, setDosages } from '../client/lib/reducer';
import { Dosage, SocketFunctions } from '../types';
import db from './lib/db';
import { log } from './lib/utils';

const methods = {} as SocketFunctions;

methods[addDosageSendServer.toString()] = (emit, emitAll) => (dosage: Dosage) => {
  log(`Dosage:${dosage.amount}`);
  delete dosage.currentAmount;
  delete dosage.timeValues;
  db.addDosage(dosage);
  emitAll(setDosages(db.getDosages()));
};

methods[deleteDosageSendServer.toString()] = (emit, emitAll) => (id: string) => {
  log(`Delete id ${id}`);
  db.deleteDosage(id);
  emitAll(setDosages(db.getDosages()));
};

export default methods;