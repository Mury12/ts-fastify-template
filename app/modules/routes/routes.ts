import { example } from './example';
import { health } from './health';
import { log } from './logger';

/**
 * Creates the array of routes to be set up.
 *
 * @param app fastify instance
 * @returns {array<Promise>} array of promises
 */
export function routes(app: any): Array<Promise<any>> {
  // Register routes here
  return [
    app.register(log, { prefix: '_/log' }),
    app.register(example, { prefix: 'example' }),
    app.register(health, { prefix: 'health' }),
  ];
}
