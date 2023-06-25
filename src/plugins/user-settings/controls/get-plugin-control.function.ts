import { DOMElementTagOptions } from '../../../lib/dom';
import { PluginSettingsSection } from '../user-settings.types';

export const getPluginControl = (
  name: string,
  data: PluginSettingsSection,
): DOMElementTagOptions<'div'> => {
  const control: DOMElementTagOptions<'div'> = {
    tag: 'div',
    id: `user-settings-${name}`,
    children: [],
  };

  if (!data.plugin.pluginOptions.canBeDisabled) {
    control.children.push({
      tag: 'div',
      innerText: data.header,
      class: ['subsection-header'],
      style: { marginTop: '1rem' },
    });
  }

  return control;
};
