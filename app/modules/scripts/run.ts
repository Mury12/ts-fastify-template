import { argv } from 'process';
import { Script } from '../abstract/Script';
import * as scripts from './index';
import { Logger } from '../services/Logger';

const [, , scriptName] = argv;

function getRunnable() {
  let runnable: Script | undefined;
  Object.keys(scripts).forEach((key) => {
    if (scripts[key] instanceof Script && scripts[key].name === scriptName) {
      runnable = scripts[key];
      return;
    }
  });
  return runnable;
}

const runnable = getRunnable();

if (!runnable) {
  Logger.force.error(`Script ${scriptName || 'unknown'} not found`);
  Logger.force.info('Script run cli usage:');
  Logger.force.info('yarn run-scripr <script-name> [...args]');
  Logger.force.info('Example:');
  Logger.force.info('yarn run-script exampleScriptCamel --example-arg "example value"');
  console.log('\n');
  Logger.force.info('Available scripts:');
  Object.keys(scripts).forEach((key) => {
    const script = scripts[key];
    if (script instanceof Script) {
      console.log(
        `\t- \x1b[33m${script.name} ${
          script.description ? `\x1b[0m\x1b[2m - ${script.description}` : ''
        }\x1b[0m`
      );
      if (script) {
        if (!script.args) return;
        console.log(`\t│\x1b[36m Arguments:\x1b[0m`);
        Object.entries(script.args || {}).forEach(([key, value], index) => {
          console.log(
            `\t${
              index + 1 === Object.keys(script.args || {}).length
                ? '└──'
                : '├──'
            } \x1b[36m--${key}: \x1b[0m\x1b[2m${
              value || '[No description]'
            }\x1b[0m`
          );
        });
      }
    }
  });
  console.log('\n');
  process.exit(1);
}
console.log('\n');
Logger.force.info(`Running script ${scriptName}`);
console.log('\n');
runnable
  .run()
  .then(() => {
    console.log('\n');
    Logger.force.info(`Script ${scriptName} finished`);
    console.log('\n');
    process.exit(0);
  })
  .catch((err) => {
    console.log('\n');
    Logger.force.error(`Script ${scriptName} failed`);
    console.log('\n');
    Logger.force.error(err);
    console.log('\n');
    process.exit(1);
  });
