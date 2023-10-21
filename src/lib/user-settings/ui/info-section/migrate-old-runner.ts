export const migrateOldRunner = (): void => {
  const jpdbScriptRunner = localStorage.getItem('JPDBScriptRunner');
  let options: {
    plugins: Record<
      string,
      {
        enabled: boolean;
        [key: string]: any;
      }
    >;
  };

  const wipeExtension = (key: string): void => {
    if (!options.plugins[key]) {
      return;
    }
    delete options.plugins[key];

    localStorage.setItem('JPDBScriptRunner', JSON.stringify(options));

    return migrateOldRunner();
  };

  if (jpdbScriptRunner?.length) {
    options = JSON.parse(jpdbScriptRunner) as typeof options;

    if (!options) {
      return;
    }

    if (Object.keys(options.plugins).length === 0) {
      localStorage.removeItem('JPDBScriptRunner');

      return location.reload();
    }

    wipeExtension('UserSettingsPlugin');
    wipeExtension('AutoSortDecksPlugin');

    if (options.plugins.TargetedSentenceCardsPlugin?.enabled) {
      jpdb.settings.moduleManager.enableModule('TSC');

      return wipeExtension('TargetedSentenceCardsPlugin');
    }

    if (options.plugins.HideDeckNumbersPlugin?.enabled) {
      jpdb.settings.moduleManager.enableModule('HideDeckNumbers');

      return wipeExtension('HideDeckNumbersPlugin');
    }

    if (options.plugins.LearningStatsPlugin?.enabled) {
      jpdb.settings.moduleManager.enableModule('LearningStats');

      return wipeExtension('LearningStatsPlugin');
    }

    if (options.plugins.MoveCardPlugin?.enabled) {
      jpdb.settings.moduleManager.enableModule('MoveCards');
      jpdb.settings.persistence.setModuleOption(
        'MoveCards',
        'objects',
        options.plugins.MoveCardPlugin.objects,
      );

      return wipeExtension('MoveCardPlugin');
    }

    if (options.plugins.UserCSSPlugin?.enabled) {
      jpdb.settings.moduleManager.enableModule('UserCSS');
      jpdb.settings.persistence.setModuleOption(
        'UserCSS',
        'styles',
        options.plugins.UserCSSPlugin.styles,
      );

      return wipeExtension('UserCSSPlugin');
    }

    if (options.plugins.ScrollControlsPlugin?.enabled) {
      const s = 'ScrollControls';
      const o = options.plugins.ScrollControlsPlugin as unknown as {
        'button-order': string;
        'button-position': string;
        'in-settings': boolean;
        'in-media-search': boolean;
        'in-deck-list': boolean;
        'set-threshold': boolean;
        threshold: string;
        'always-rerender': boolean;
      };

      jpdb.settings.moduleManager.enableModule(s);
      jpdb.settings.persistence.setModuleOption(s, 'button-order', o['button-order']);
      jpdb.settings.persistence.setModuleOption(s, 'button-position', o['button-position']);
      jpdb.settings.persistence.setModuleOption(s, 'in-settings', o['in-settings']);
      jpdb.settings.persistence.setModuleOption(s, 'in-media-search', o['in-media-search']);
      jpdb.settings.persistence.setModuleOption(s, 'in-deck-list', o['in-deck-list']);
      jpdb.settings.persistence.setModuleOption(s, 'in-deck-list', o['in-deck-list']);
      jpdb.settings.persistence.setModuleOption(s, 'set-threshold', o['set-threshold']);
      jpdb.settings.persistence.setModuleOption(s, 'threshold', o.threshold);

      return wipeExtension('ScrollControlsPlugin');
    }

    if (options.plugins.CustomLinksPlugin?.enabled) {
      const s = 'CustomLinks';
      const o = options.plugins.CustomLinksPlugin as unknown as {
        'top-links': { url: string; label: string }[];
        'bottom-links': { url: string; label: string }[];
      } & { [key in `hide-${string}`]: boolean };

      [
        { url: '/prebuilt_decks', label: 'Built-in decks' },
        { url: '/stats', label: 'Stats' },
        { url: '/settings', label: 'Settings' },
        { url: '/logout', label: 'Logout' },
      ].forEach(({ url, label }) => {
        if (o[`hide-${url}`] === false) {
          o['top-links'].push({ url, label });
        }
      });

      [
        { url: '/about', label: 'About' },
        { url: '/faq', label: 'FAQ' },
        { url: '/contact-us', label: 'Contact us' },
        { url: '/privacy-policy', label: 'Privacy policy' },
        { url: '/terms-of-use', label: 'Terms of use' },
        { url: '/changelog', label: 'Changelog' },
      ].forEach(({ url, label }) => {
        if (o[`hide-${url}`] === false) {
          o['bottom-links'].push({ url, label });
        }
      });

      jpdb.settings.moduleManager.enableModule(s);
      jpdb.settings.persistence.setModuleOption(s, 'header', o['top-links']);
      jpdb.settings.persistence.setModuleOption(s, 'footer', o['bottom-links']);

      return wipeExtension('CustomLinksPlugin');
    }

    localStorage.removeItem('JPDBScriptRunner');
    location.reload();
  }
};
