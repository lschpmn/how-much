import express, { Express, Request, Response } from 'express';
import { Server as ServerType } from 'http';
import { join } from 'path';
import { Server, Socket } from 'socket.io';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { initSet } from '../client/reducers/dosages';
import { Action, EmitAction } from '../types';
import webpackConfig from '../webpack.config';
import services from './services';
import db from './lib/db';
import { getCommandLineArguments, log } from './lib/utils';

const { DEVELOP } = getCommandLineArguments();

export const connectSocket = (server: ServerType) => {
  // Socket.IO
  const io = new Server(server, { maxHttpBufferSize: 1024 * 1024 * 500 /*500MB*/ });
  io.on('connection', (socket: Socket) => {
    log('client connected', null, socket.handshake);
    const emitAction = createOutgoingFunc(socket);
    const emitAllAction = createOutgoingAllFunc(io);

    for (let actionType in services) {
      const func = services[actionType];
      socket.on(actionType, (p?: any) => {
        log(`Incoming - ${actionType}`, null, socket.handshake);
        func(emitAction, emitAllAction, socket)(p);
      });
    }

    emitAction(initSet([db.getDosages(), db.getTypes()]), 'Client Init');

    socket.on('disconnect', () => log('client disconnected', null, socket.handshake));
  });
};

export const connectWeb = (app: Express) => {
  // Webpack
  if (DEVELOP) {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {}));
    app.use(webpackHotMiddleware(compiler));
  }

  app.use((req, res, next) => {
    log('file response', req);
    next();
  });

  // App Routes
  app.use(express.static(join(__dirname, '..', 'public')));

  app.use((req, res) => {
    res.sendFile(join(__dirname, '..', 'client', 'index.html'));
  });
};

const createOutgoingFunc = (socket: Socket): EmitAction => (action: Action<any>, reason?: string) => {
  log(`Outgoing - ${action.type}` + (reason ? ` - ${reason}` : ''), null, socket.handshake);
  socket.emit('action', action);
};

const createOutgoingAllFunc = (io: Server): EmitAction => (action: Action<any>, reason?: string) => {
  log(`Outgoing All - ${action.type}` + (reason ? ` - ${reason}` : ''));
  io.emit('action', action);
};
