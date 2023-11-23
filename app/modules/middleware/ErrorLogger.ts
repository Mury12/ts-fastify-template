import * as Sentry from '@sentry/node';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../../config/config';
import { Logger } from '../services/Logger';

async function handleSentry(
  req: FastifyRequest,
  res: FastifyReply,
  error: FastifyError
) {
  if (res?.statusCode >= 500) {
    Sentry.captureException(error, {
      extra: {
        request: {
          body: JSON.stringify(req.body),
          params: JSON.stringify(req.params),
          url: req.url,
        },
        response: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        },
      },
    });
  }
}

/**
 * Logs errors thrown in a request
 *
 * @param {*} req
 * @param {*} res
 * @param {*} error
 * @param {*} done
 */
export const ErrorLogger = (
  req: FastifyRequest,
  res: FastifyReply,
  error: FastifyError
) => {
  Logger.log(error);
  if (config.logging) {
    config.__logPool.push({
      type: 'GLOBAL_CATCHER',
      request: {
        body: req.body,
        params: req.params,
        context: req.context.config,
      },
      error: error.message,
    });
  }

  handleSentry(req, res, error);
};
