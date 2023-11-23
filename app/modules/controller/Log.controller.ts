import { config } from '../../config/config';
import { Logger } from '../services/Logger';

/**
 * Log Controller
 *
 * This class represents the Log entity and extends the AbstractEntity.
 *
 */
export class LogController /*extends AbstractDBClient client*/ {
  protected table = 'ErrorLogger';
  protected data: any;

  constructor(data: any) {
    // super();
    this.data = data;
  }

  /**
   * Dispatch log data to the database
   */
  static async dispatch() {
    const logPool = config.__logPool;
    if (logPool.length) {
      const ctl = new LogController(logPool);
      try {
        // Send to database
        // await ctl.create();
        config.__logPool.splice(0);
      } catch (error) {
        Logger.log(`LogController::dispatch::ErrorLogger::catch`, error);
      }
    }
    return;
  }
}
