import { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../../../config/config';

/**
 * GET one row from DB
 * @param {*} req
 * @param {*} res
 */
const status = async (req: FastifyRequest, res: FastifyReply) => {
  // let redisStatus = 'ok';
  // let redisCount = 0;
  // let dbStatus = 'ok';
  // let dbCount = 0;

  // try {
  //   redisCount = await config.redis.instance.client.dbsize();
  // } catch {
  //   redisStatus = 'error';
  // }

  const status = {
    env: process.env.NODE_ENV,
    status: 'ok',
    // redis: {
    //   status: redisStatus,
    //   entities: redisCount,
    // },
    // db: {
    //   status: dbStatus,
    //   entities: dbCount,
    // },
  };
  res.send(status);
};

export const Module = {
  name: 'health',
  status,
};
