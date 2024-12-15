import { addDosageSendServer } from '../client/lib/reducer';
import { Dosage, SocketFunctions } from '../types';
import db from './lib/db';
import { log } from './lib/utils';

const methods = {} as SocketFunctions;

methods[addDosageSendServer.toString()] = (emit) => (dosage: Dosage) => {
  log('Adding new dosage');
  db.addDosage(dosage);
};

export default methods;