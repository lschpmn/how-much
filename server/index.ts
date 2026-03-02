import express from 'express';
import { createServer } from 'http';
import { connectSocket, connectWeb } from './client-connection';
import { getCommandLineArguments, log } from './lib/utils';

const { PORT } = getCommandLineArguments();

const app = express();
const server = createServer(app);

connectSocket(server);
connectWeb(app);

app.use((err, req, res, next) => {
  log(err);
  log(err.stack);
  res.status(500).send(err);
});

server.listen(PORT, () => log(`started server at http://localhost:${PORT}`));
