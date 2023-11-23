import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorLogger } from '../middleware/ErrorLogger';
import { config } from '../../config/config';

export const onError = (
  req: FastifyRequest,
  res: FastifyReply,
  error: any,
  done: () => void
) => {
  if (['any', 'error-only'].includes(config.logLevel))
    ErrorLogger(req, res, error);
  done();
};
