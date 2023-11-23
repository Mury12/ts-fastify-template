import { RedisClient } from '../modules/controller/Redis.controller';
// import { PrismaClient } from 'prisma/prisma-client';
import { Logger } from '../modules/services/Logger';
import { NodeOptions } from '@sentry/node';

if (process.env) {
  const dotenv = require('dotenv');
  dotenv.config();
}

const config = {
  __logPool: [],
  env: process.env.NODE_ENV || 'development',
  logging: process.env.LOGGING && process.env.LOGGING === 'true' ? true : false,
  logLevel:
    process.env.LOG_LEVEL ||
    ('error-only' as 'error-only' | 'action-only' | 'any'),
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    enabled: false,
    tracesSampleRate: +process.env.SENTRY_SAMPLE_RATE || 1.0,
    environment: process.env.NODE_ENV || 'development',
  } as NodeOptions,
  // prisma: {
  //   instance: null as PrismaClient,
  //   maxTries: 5,
  //   createInstance: async (tryCount = 1) => {
  //     Logger.log('Trying to connect to Postgres. Counter: ', tryCount);
  //     if (config.prisma.instance) return;

  //     try {
  //       config.prisma.instance = new PrismaClient({
  //         log: config.logging ? ['query'] : [],
  //       });
  //     } catch (error) {
  //       if (tryCount < config.prisma.maxTries) {
  //         Logger.log("Couldn't connect to the datbase, retrying.");
  //         await config.prisma.createInstance(++tryCount);
  //       } else {
  //         Logger.log(error);
  //         throw new Error(
  //           `Couldn't connect to the database and gave up after ${config.prisma.maxTries} tries.`
  //         );
  //       }
  //     }
  //   },
  // },
  redis: {
    host: process.env['REDIS_HOST'],
    username: process.env['REDIS_USER'],
    password: process.env['REDIS_PASSWORD'],
    port: +process.env['REDIS_PORT'] || 6379,
    cacheTime: +process.env['REDIS_CACHE_TIME'] || 60 * 60 * 24,
    instance: null as RedisClient,
    maxTries: 5,
    createInstance: async (tryCount = 1) => {
      Logger.log('Trying to connect to Redis. Counter: ', tryCount);
      try {
        config.redis.instance = new RedisClient(
          config.redis.cacheTime,
          config.redis.host,
          config.redis.port,
          config.redis.maxTries,
          'gap-indexer-cache:'
        );
      } catch (error) {
        if (tryCount < config.redis.maxTries) {
          Logger.log("Couldn't connect to the datbase, retrying.");
          await config.redis.createInstance(++tryCount);
        } else {
          Logger.log(error);
          throw new Error(
            `Couldn't connect to redis and gave up after ${config.redis.maxTries} tries.`
          );
        }
        return;
      }
    },
  },
  server: {
    port: process.env['SERVER_PORT'],
  },
  mailer: {
    apiKey: process.env['EMAIL_SERVICE_API_KEY'],
    domain: process.env['EMAIL_SERVICE_DOMAIN'],
  },
  discord: {
    webhookUrl: null,
  },
  appUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://gap.karmahq.xyz'
      : 'https://gapstag.karmahq.xyz',
};

type Config = typeof config;

export { config, Config };
