import * as fs from 'fs';
import moment from 'moment';
import { config } from '../../config/config';

/**
 * Saves logs to a file
 *
 * @version 0.0.1
 * @author Andre Mury
 *
 * ----
 * Example usage:
 *
 * try {
 * ...
 *
 * } catch ( error ) {
 *
 *   const log = new Log('error', req.path, error);
 *
 *   if ( log.save() ) log.show();
 *
 * }
 */
export class Logger {
  private static ignoreEnv = false;
  data: any;
  defaultPath = 'app/logs';
  fullPath = '';
  route = '/';
  file = {
    action: 'actions.json',
    error: 'errors.json',
  };
  type: 'error' | 'action';

  constructor(
    type: 'error' | 'action',
    route?: string,
    data?: any,
    defaultPath?: any
  ) {
    this.data = data ? { meta: { ...data } } : {};
    this.route = route || this.route;
    this.defaultPath = defaultPath || this.defaultPath;

    this.fullPath = `${this.defaultPath}/${this.file[type]}`;
  }

  /**
   * Saves the constructed log
   *
   * @return {Boolean}
   */
  save(): boolean {
    if (config.logging) {
      const log = JSON.parse(fs.readFileSync(this.fullPath).toString() || '[]');
      log.push({ ...this.data, time: moment(), route: this.route });

      try {
        fs.writeFileSync(this.fullPath, JSON.stringify(log));
        return true;
      } catch (err) {
        Logger.error(err);
        return !!!err;
      }
    }
    return true;
  }

  /**
   * Set log type to action or error
   * @param {string} type
   */
  setType(type: 'error' | 'action') {
    this.type = type;
    this.fullPath = `${this.defaultPath}/${this.file[type]}`;
    return this;
  }

  /**
   * Append data to the meta tag in log
   * @param {*} data
   */
  setData(data: any) {
    this.data = { meta: [this.data.meta, data] };
    return this;
  }

  clearAll() {
    Object.keys(this.file).map((file) => {
      fs.writeFileSync(`${this.defaultPath}/${this.file[file]}`, '[]');
    });
    this.setData({ action: 'cleared logs' });
    return this;
  }

  /**
   * Returns the complete log file
   *
   * @return {Array<any>}
   */
  show(): Array<any> {
    const log = JSON.parse(fs.readFileSync(this.fullPath).toString());
    return log;
  }

  private static _log(...args: any[]) {
    if (config.logging || this.force || this.ignoreEnv) console.log(...args);
    this.ignoreEnv = false;
  }

  static log(...args: any[]) {
    this._log('\x1b[92m[LOG]\x1b[0m', ...args);
  }

  static error(message: string, ...optionalParams: any[]) {
    this._log('\x1b[31m[ERROR]\x1b[0m', message, ...optionalParams);
  }

  static info(message: string, ...optionalParams: any[]) {
    this._log('\x1b[96m[INFO]\x1b[0m', message, ...optionalParams);
  }

  static debug(message: string, ...optionalParams: any[]) {
    this._log('\x1b[93m[DEBUG]\x1b[0m', message, ...optionalParams);
  }

  static warn(message: string, ...optionalParams: any[]) {
    this._log('\x1b[93m[WARN]\x1b[0m', message, ...optionalParams);
  }

  static get force() {
    this.ignoreEnv = true;
    return Logger;
  }
}
