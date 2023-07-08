import EventEmitter from 'events';

export {};

declare global {
  interface Window {
    bubble: (source: EventEmitter, target: EventEmitter, ...events: string[]) => void;
  }

  const bubble: typeof window.bubble;
}

window.bubble = (source: EventEmitter, target: EventEmitter, ...events: string[]): void =>
  events.forEach((event) => source.on(event, (...args: unknown[]) => target.emit(event, ...args)));
