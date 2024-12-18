import express, { Express, Request, Response } from 'express';
import { Server as ServerType } from 'https';
import { join } from 'path';
import { Server, Socket } from 'socket.io';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { setDosages } from '../client/lib/reducer';
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
    const emitAction = createOutgoingFunc(socket);
    log('client connected');

    for (let actionType in services) {
      const func = services[actionType];
      socket.on(actionType, (p?: any) => {
        log(`Incoming - ${actionType}`);
        func(emitAction)(p);
      });
    }

    emitAction(setDosages(db.getDosages()), 'Client Init');

    socket.on('disconnect', () => log('client disconnected'));
  });
};

export const connectWeb = (app: Express) => {
  // Webpack
  if (DEVELOP) {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {}));
    app.use(webpackHotMiddleware(compiler));
  }

  // App Routes
  app.use(express.static(join(__dirname, '..', 'public')));

  app.use((req: Request, res: Response) => {
    log(`404 - ${req.url} - sending index.html`);
    res.sendFile(join(__dirname, '..', 'client', 'index.html'));
  });
};

const createOutgoingFunc = (socket: Socket): EmitAction => (action: Action<any>, reason?: string) => {
  log(`Outgoing - ${action.type}` + (reason ? ` - ${reason}` : ''));
  socket.emit('action', action);
};
