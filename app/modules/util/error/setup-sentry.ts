import { config } from '../../../config/config';
import * as Sentry from '@sentry/node';

export async function setupSentry() {
  ['staging', 'production'].includes(config.env);

  if (config.sentry.dsn) Sentry.init(config.sentry);
}
