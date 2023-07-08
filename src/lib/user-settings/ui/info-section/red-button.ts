import { button } from '../../../elements/button';

export const redButton = (text: string, handler: () => void): HTMLInputElement =>
  button(text, { handler, type: 'error' });
