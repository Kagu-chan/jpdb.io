import { WELCOME } from '../../constants';
import { JPDBPlugin } from '../../jpdb/plugin';

export class HelloWorldPlugin extends JPDBPlugin(/.*/) {
  public run(): boolean {
    // eslint-disable-next-line no-console
    console.log(WELCOME);

    return false;
  }
}
