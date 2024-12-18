import { addDosageSendServer, deleteDosageSendServer } from '../client/lib/reducer';
import { Dosage, SocketFunctions } from '../types';
import db from './lib/db';
import { log } from './lib/utils';

const methods = {} as SocketFunctions;

methods[addDosageSendServer.toString()] = (emit) => (dosage: Dosage) => {
  log(`Dosage:${dosage.amount}`);
  db.addDosage(dosage);
};

methods[deleteDosageSendServer.toString()] = (emit) => (id: string) => {
  log(`Delete id ${id}`);
  db.deleteDosage(id);
};

export default methods;