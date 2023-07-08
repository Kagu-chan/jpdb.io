import EventEmitter from 'events';

export {};

declare global {
  interface Window {
    bubble: (source: EventEmitter, target: EventEmitter, event: string) => void;
  }

  const bubble: typeof window.bubble;
}

window.bubble = (source: EventEmitter, target: EventEmitter, event: string): void => {
  source.on(event, (...args: unknown[]) => target.emit(event, ...args));
};
