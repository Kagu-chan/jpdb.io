import { IJPDBPlugin } from './plugin.interface';

export const JPDBPlugin = (...activeAt: (RegExp | string)[]) =>
  class implements IJPDBPlugin {
    protected static activeAt: (RegExp | string)[] = activeAt;
    protected static path: string = window.location.pathname;

    public static isActive(): boolean {
      return !!this.activeAt.find((expression) =>
        typeof expression === 'string' ? expression === this.path : expression.test(this.path),
      );
    }

    public run(): boolean {
      throw new Error();
    }
  };
