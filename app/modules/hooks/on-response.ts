import { config } from '../../config/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LogController } from '../controller/Log.controller';

export const onResponse = async (req: FastifyRequest, res: FastifyReply) => {
  if (res.statusCode >= 400) {
    config.__logPool.push({
      type: 'GLOBAL_CATCHER',
      request: {
        params: req.params,
        query: req.query,
        context: req.context.config,
      },
      statusCode: res.statusCode,
      headers: res.getHeaders(),
    });
  }
  await LogController.dispatch();
};
