import { JPDBScriptRunner } from './jpdb/script-runner';
import { HelloWorldPlugin } from './plugins/hello-word/hello-world.plugin';

JPDBScriptRunner.getInstance().add(HelloWorldPlugin);
