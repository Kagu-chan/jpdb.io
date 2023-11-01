export const redButton = (text: string, handler: () => void): HTMLInputElement =>
  document.util.button(text, { handler, type: 'error' });
