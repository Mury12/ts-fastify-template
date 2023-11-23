import Redis from 'ioredis';
import { Logger } from '../services/Logger';

class RedisClient {
  /**
   * RedisClient
   */
  private cli: Redis;

  /**
   * Time to leave
   */
  private ttl: number;

  constructor(
    ttl: number = 30,
    host: string,
    port = 6379,
    maxTries: number | null = null,
    keyPrefix = 'cache:'
  ) {
    this.ttl = ttl;
    this.cli = new Redis({
      keyPrefix,
      host,
      port,
      maxRetriesPerRequest: maxTries,
      retryStrategy: (times) => {
        Logger.log(`Retrying connection (${times})...`);
        return maxTries;
      },
    });
  }

  /**
   * returns the value of the provided key
   * @param key
   * @returns
   */
  async get<T>(
    key: string,
    defaultValue?: T
  ): Promise<typeof defaultValue | (typeof defaultValue)[]> {
    if (this.cli.status === 'ready') {
      const value = await this.cli.get(key);
      return value ? JSON.parse(value) : defaultValue;
    }
    return defaultValue;
  }

  /**
   * returns the value of the provided array of keys
   * @param key
   * @returns
   */
  async mget<T>(
    key: string[],
    defaultValue?: T[]
  ): Promise<typeof defaultValue> {
    if (this.cli.status === 'ready') {
      const value = await this.cli.mget(key);
      return value?.map((item) => JSON.parse(item)) || defaultValue;
    }
    return defaultValue;
  }

  /**
   * Sets a new value to a key with 30 secs of duration
   * if time is provided then it will have that value of duration
   * @param key
   * @param value
   * @param time
   * @returns
   */
  async set(key: string, value: unknown, time?: number) {
    return this.cli.set(key, JSON.stringify(value), 'EX', time || this.ttl);
  }

  /**
   * sets a key to redis without time-to-leave
   * @param key
   * @param value
   * @returns
   */
  async setInfinite(key: string, value: unknown) {
    return this.cli.set(key, JSON.stringify(value));
  }

  /**
   * delete redis key
   * @param key
   * @returns
   */
  delete(key: string) {
    return this.cli.del(key);
  }

  /**
   * delete all keys with
   * @param prefix
   * @returns
   */
  async deletePrefix(prefix: string) {
    const keys = (await this.cli.keys(`cache:${prefix}:*`)).map((key) =>
      key.replace('cache:', '')
    );
    return this.cli.del(keys);
  }

  /**
   * returns all the keys in cache by prefix
   * @param prefix "cache:coin:*" will return every coin
   * @returns
   */
  async getKeys(prefix: string) {
    return this.cli.keys(prefix);
  }

  /**
   * Clear all keys
   */
  async clear() {
    Logger.log('Clearing cache...');
    return this.cli.flushall();
  }

  /**
   * Clear a key by prefix
   */
  async clearPrefix(prefix: string) {
    return this.getKeys(prefix).then((keys) => this.cli.del(keys));
  }

  /**
   * Checks time to leave of a key
   * @param key
   * @returns
   */
  async ttlCheck(key: string) {
    return this.cli.ttl(key);
  }

  /**
   * Makes the redis connection
   * @returns
   */
  connect() {
    return this.cli.connect();
  }

  disconnect() {
    return this.cli.disconnect();
  }

  isConnected() {
    return this.cli.status;
  }

  ping() {
    return this.cli.ping();
  }
  get client() {
    return this.cli;
  }
}

export { RedisClient };
