import express from 'express';
import { read } from 'fs-jetpack';
import { createServer as createHttpServer } from 'http';
import { createServer } from 'https';
import { join } from 'path';
import { connectSocket, connectWeb } from './client-connection';
import { getCommandLineArguments, log } from './lib/utils';

const { PORT } = getCommandLineArguments();
const SECURE_PORT = PORT + 1;

// command to make ssl cert
// openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ./bin/server.key -out ./bin/server.cert
const app = express();
const server = createServer({
  key: read(join(__dirname, '../bin/server.key')),
  cert: read(join(__dirname, '../bin/server.cert')),
}, app);

app.use((req, res, next) => {
  // x-real-ip = ip address from nginx
  const ip = (req.header('x-real-ip') || req.ip).replace('::ffff:', '');
  log(`ip:${ip} - url:${req.url}`);
  next();
});

connectSocket(server);
connectWeb(app);

app.use((err, req, res, next) => {
  log(err);
  log(err.stack);
  res.status(500).send(err);
});

server.listen(SECURE_PORT, () => log(`started server at https://localhost:${SECURE_PORT}`));

// Redirect Functionality
const redirectApp = express();
const redirectServer = createHttpServer(redirectApp);

redirectApp.use((req, res) => {
  res.redirect(`https://${req.hostname}:${SECURE_PORT}${req.url}`);
});

redirectServer.listen(PORT, () => log(`started redirect server at http://localhost:${PORT}`));
