import { config } from '../../config/config';

export const startDbs = async () =>
  Promise.all([
    /*config.redis.createInstance(), config.prisma.createInstance()*/
  ]);
