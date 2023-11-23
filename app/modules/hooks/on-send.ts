import { FastifyReply, FastifyRequest } from 'fastify';
import sha256 from 'sha256';
import { config } from '../../config/config';

const disableCacheFor = ['health', 'admin'];

function shouldCache(req: FastifyRequest): boolean {
  if (req.method !== 'GET' || !config.redis.instance) return false;

  for (const path of disableCacheFor) {
    if (req.url.includes(path)) return false;
  }

  return true;
}

export const onSend = async (
  req: FastifyRequest,
  res: FastifyReply,
  payload: any
) => {
  if (shouldCache(req)) {
    const key = sha256(req.url);
    const cache = await config.redis.instance.get(key);
    if (!cache) await config.redis.instance.set(key, JSON.stringify(payload));
  }
};
