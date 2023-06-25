import { DOMContainer } from '../../lib/browser/dom-container';
import { appendElement } from '../../lib/dom';
import { Globals } from '../../lib/globals';
import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginOptions, PluginUserOptionFieldType, PluginUserOptions } from '../../lib/types';
import { CSSPlugin } from '../css/css.plugin';
import { getResetControl } from './controls/get-reset-control.function';
import { getUpdateControl } from './controls/get-update-control.function';
import { renderSaveControl } from './controls/render-save-control.function';
import { UserSettingsSection } from './controls/user-settings.section';
import { UserSettingsPluginAPI } from './user-settings-plugin.api';
import { PluginSettingsSection } from './user-settings.types';

const collapsibleCSS = `
.user-settings .word-list p ul {
  margin-bottom: 0;
}

.user-settings .word-list {
  padding: 1rem 0 0;
}

.user-settings .word-list p {
  margin: 1rem 0 0;
}

.user-settings .controls-list input {
  margin: .5rem .5rem 0 0;
}

.user-settings .input-list .input-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.user-settings .input-list input[type=text],
.user-settings .input-list input[type=number] {
  margin: 0 1rem .5rem 0;
  padding: 0 1rem;
}

.user-settings .input-list input[type=submit] {
  margin-bottom: .5rem;
}

.user-settings .deck-sidebar {
  display: inline-flex;
  padding-left: 0;
}

.user-settings .arrow-control {
  border: 0;
  background: none;
  box-shadow: none;
  margin-bottom: 0;
  height: 22px;
  padding: 0 1.4rem 0 .5rem;
}

.user-settings .arrow-control:hover {
  border: 0;
  transform: none;
  box-shadow: none;
  color: var(--button-hover-border-color);
}

.user-settings .input-list .input-item:first-of-type .arrow-control.up { opacity: 0; }
.user-settings .input-list .input-item:last-of-type .arrow-control.down { opacity: 0; }
`;

export class UserSettingsPlugin extends JPDBPlugin {
  protected domElement: HTMLDivElement;
  protected sections = new Map<string, PluginSettingsSection>();

  protected dom: DOMContainer;
  protected api: UserSettingsPluginAPI;

  protected _pluginOptions: PluginOptions = {
    name: 'User-Settings',
    enableText: 'Additional Settings',
    activeAt: '/settings',
    canBeDisabled: false,
    runAgain: false,
  };

  protected _userSettings: PluginUserOptions = [
    {
      key: 'enable-beta',
      type: PluginUserOptionFieldType.CHECKBOX,
      default: false,
      text: 'Enable beta plugins',
      description: 'Enable beta plugins and unfinnished plugins',
    },
  ];

  protected run(): void {
    const enableBeta = this.getUsersSetting<boolean>('enable-beta');

    this.api = new UserSettingsPluginAPI();
    this.api.buildMaps(enableBeta);

    const sections = this.getSections();

    this.addStyles();
    this.addContainer(sections);
    renderSaveControl(this.api);
  }

  protected getSections(): UserSettingsSection[] {
    const sections: UserSettingsSection[] = [];

    this.api.sections.forEach((section: PluginSettingsSection, key: string) => {
      sections.push(new UserSettingsSection(key, section));
    });

    return sections;
  }

  protected addStyles(): void {
    Globals.pluginManager.get(CSSPlugin).register(UserSettingsPlugin.name, collapsibleCSS);
  }

  protected addContainer(sections: UserSettingsSection[]): void {
    appendElement('.container.bugfix', {
      tag: 'div',
      id: 'user-settings',
      children: [
        { tag: 'h6', innerText: 'Extension settings' },
        ...sections.map((s) => s.getControl()),
        { tag: 'h5', innerText: 'Other' },
        getResetControl(this.api),
        getUpdateControl(),
      ],
    });
  }
}
