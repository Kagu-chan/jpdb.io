import { NAME } from '../constants';
import { PluginUserOptions } from '../types';

type Settings = {
  enabled?: Record<string, boolean>;
  pluginOptions?: Record<string, PluginUserOptions>;
};

export class Persistence {
  private _storage: Storage;
  private _defaults: Required<Settings> = {
    enabled: {},
    pluginOptions: {},
  };
  private _settings: Settings = {};

  constructor() {
    this._storage = window.localStorage;

    const options = this._storage.getItem(NAME);

    if (options) {
      this._settings = JSON.parse(options) as Settings;
    }
  }

  public unset(): void {
    window.localStorage.removeItem(NAME);
  }

  public get<K extends keyof Settings>(key: K): Settings[K] {
    return this._settings[key] ?? this._defaults[key];
  }

  public set<K extends keyof Settings>(key: K, value: Settings[K]): Settings[K] {
    this._settings[key] = value;

    window.localStorage.setItem(NAME, JSON.stringify(this._settings));

    return value;
  }
}
