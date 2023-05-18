import { WELCOME } from '../../constants';
import { JPDBPlugin } from '../../jpdb/plugin';

export class HelloWorldPlugin extends JPDBPlugin(/.*/) {
  public run(): boolean {
    console.log(WELCOME);

    return false;
  }
}
