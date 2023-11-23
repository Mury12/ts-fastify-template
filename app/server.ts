// Dependencies
const cookie = require('fastify-cookie');
const cors = require('fastify-cors');

import fastify, { FastifyInstance } from 'fastify';
import { config } from './config/config';
import { router } from './modules/routes';
import { startDbs } from './modules/util/start-databases';
import { Logger } from './modules/services/Logger';
// Hooks
import { onResponse } from './modules/hooks/on-response';
import { onError } from './modules/hooks/on-error';
import { onRequest } from './modules/hooks/on-request';
import { onSend } from './modules/hooks/on-send';
// Initializers
import { setupSentry } from './modules/util/error/setup-sentry';

const pollOnly = process.env.POLL_ONLY === 'true';

process.setMaxListeners(15);

/**
 * Mounts the server
 *
 * @returns app
 */
async function mount(): Promise<FastifyInstance> {
  const app = fastify({
    logger: config.env.match(/development/) && {
      prettyPrint: {
        colorize: true,
      },
    },
  });

  const startup: unknown[] = [
    app.register(cors, {
      methods: 'HEAD, OPTIONS, PUT, POST, PATCH, GET, DELETE',
      allowedHeaders: 'content-type, authorization, x-usr-addr',
      credentials: true,
      maxAge: 1000 * 60 * 24,
      origin: '*',
    }),
    app.register(cookie),
    startDbs(),
    setupSentry(),
  ];

  await Promise.all(startup);
  // setup sentry after db is ready

  /**
   * This hooks acts as middlewares performing
   * actions on each one of these calls
   * -----
   * Logs route actions
   */

  app.addHook('onRequest', onRequest);
  app.addHook('onError', onError);
  app.addHook('onResponse', onResponse);
  app.addHook('onSend', onSend);

  /** Register routes */
  await router(app);

  return app;
}

/** Server start */
mount()
  .then((app) => {
    app.listen(config.server.port ?? 3001, '0.0.0.0', (error, addr) => {
      if (error) {
        Logger.force.error(error.message);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
