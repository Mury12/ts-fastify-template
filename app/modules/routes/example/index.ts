import { FastifyInstance } from 'fastify';
import { Module } from './example.module';

/**
 * Exports the users actions routes.
 * @param {*} router
 * @param {*} options
 */
export const example = async (router: FastifyInstance) => {
  router.get('/:id', Module.get);
  router.put('/:id', Module.update);
  router.delete('/:id', Module.remove);
  router.post('/', Module.create);
  router.get('/', Module.getAll);
};
