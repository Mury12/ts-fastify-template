import { Logger } from '../services/Logger';
import * as Sentry from '@sentry/node';

export interface PollArgs {
  name: string;
  ttl: number;
  resource?: string;
  callback?: (resourceResult: unknown, ...args: unknown[]) => void;
}

export default abstract class Poll<T = unknown> {
  private interval: NodeJS.Timer;

  /**
   * In seconds
   */
  protected ttl: number;
  /**
   * Function executed after fetch
   * Will receive the result of the fetch
   */
  protected callback: (
    resourceResult: T,
    ...args: unknown[]
  ) => void | Promise<void>; //function executed every polling iteration
  /**
   * Resource to be fetched (uri)
   */
  protected resource?: string; // link api
  protected enabled: boolean = true; // enable or disable polling
  protected isRunning = false;

  public readonly name?: string; // name of the poll

  constructor(args: PollArgs) {
    this.ttl = args.ttl;
    this.callback = args.callback;
    this.resource = args.resource;
    this.name = args.name;
  }

  /**
   * Fetch resource
   */
  abstract fetch(): Promise<T>;

  /**
   * Function executed before init
   * This function is used to set up the poll
   * in runtime, for example, restarting when
   * ttl changes.
   */
  protected abstract beforeInit(): Promise<void>;

  /**
   * Function executed before run
   * This function is used to set up the poll
   * For example, to set up async settings
   */
  protected abstract beforeRun(): Promise<void>;

  /**
   * Check if the poll is enabled
   * This function is used to check if the poll will run
   * and it runs every interval.
   */
  protected abstract checkIsEnabled(): Promise<void>;

  private async _fetch() {
    if (!this.isRunning) {
      this.isRunning = true;
      try {
        await this.checkIsEnabled();
        await this.beforeRun();
        if (!this.enabled) return;
        const result = await this.fetch();
        await this.callback?.(result);
      } catch (error) {
        Logger.force.error(error.message);
        Sentry.captureException(error);
      } finally {
        this.isRunning = false;
      }
    } else {
      Logger.info(`Poll ${this.name} is still running, witing next cycle.`);
    }
  }

  /**
   * Initiates the counter
   */
  async init() {
    if (this.interval) this.destroy();
    // First fetch
    Logger.force.info(`Poll ${this.name} started.`);
    await this.beforeInit();
    await this._fetch();
    this.interval = setInterval(async () => {
      await this._fetch();
    }, this.ttl * 1000);
  }

  async getLastPollMeta() {
    // Get last poll metadata
    // To be used in the next poll
    // This should be stored on a db
    // so the poll can continue from the last walk
    // It can be timestamp, ids, or whatever makes the poll
    // identify from where it should start
  }

  async updatePollMeta(): /** wathever is used in the getLastPollMeta */
  Promise<void> {
    // Update your db with the last poll meta AFTER the poll is completed
    // meaning this should occur after callback is called OR if no callback,
    // after the fetch is completed
  }

  protected async getSettings(name: string) {
    // Get settings from db
    // Such as is enabled, poll ttl, etc
  }

  /**
   * Destroy the counter
   */
  destroy() {
    Logger.info(`Poll ${this.name} destroyed.`);
    clearInterval(this.interval);
  }

  /**
   * Generate poll status for the frontend and healthcheck
   */
  abstract status(): Promise<unknown>;
}
