import { Socket } from 'socket.io';
import { addDosageSendServer, deleteDosageSendServer, setDosages } from '../client/reducers/dosages';
import { Dosage, SocketFunctions } from '../types';
import db from './lib/db';
import { log } from './lib/utils';

const methods = {} as SocketFunctions;

methods[addDosageSendServer.toString()] = (emit, emitAll, socket: Socket) => (dosage: Dosage) => {
  log(`Dosage:${dosage.amount}`, null, socket.handshake);
  db.addDosage(dosage);
  emitAll(setDosages(db.getDosages()));
};

methods[deleteDosageSendServer.toString()] = (emit, emitAll, socket: Socket) => (id: string) => {
  log(`Delete id ${id}`, null, socket.handshake);
  db.deleteDosage(id);
  emitAll(setDosages(db.getDosages()));
};

export default methods;