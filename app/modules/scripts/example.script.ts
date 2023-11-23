import { Script } from '../abstract/Script';
import { Logger } from '../services/Logger';

async function runnable(this: Script) {
  const { exampleArg, exampleArg2 } = this.getParameters({
    exampleArg: '--example-arg:string',
    exampleArg2: '--exampleArg:string',
  });
  Logger.info('Hello World!');
  Logger.info('Congratulations! You ran the example script!');
  Logger.force.info(exampleArg, exampleArg2);
}

const exampleScriptCamel = new Script(
  'exampleScriptCamel',
  runnable,
  'This is an example script',
  {
    '--example-arg': 'This is an example argument description',
    '--exampleArg': 'This is an example argument description',
  }
);

const exampleScriptKebab = new Script(
  'example-script-kebab',
  runnable,
  'This is an example script',
  {
    '--example-arg': 'This is an example argument description',
    '--exampleArg': 'This is an example argument description',
  }
);

export { exampleScriptCamel, exampleScriptKebab };
