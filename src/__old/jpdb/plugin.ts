import { IJPDBPlugin, PluginStatic } from '../types';

export const JPDBPlugin = (...activeAt: (RegExp | string)[]): PluginStatic =>
  class implements IJPDBPlugin {
    public readonly path: string = window.location.pathname;
    public readonly search: string = window.location.search.replace('?', '');

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
