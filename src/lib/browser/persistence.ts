import { NAME } from '../constants';

type PluginName = string;
type OptionName = string;
type OptionValue = unknown;
type PluginOptions = Record<OptionName, OptionValue>;
type Settings = {
  plugins?: Record<PluginName, PluginOptions>;
};

export class Persistence {
  private _storage: Storage;
  private _defaults: Required<Settings> = {
    plugins: {},
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
