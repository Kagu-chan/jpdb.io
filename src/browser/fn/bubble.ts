import EventEmitter from 'events';

export const _bubble = (source: EventEmitter, target: EventEmitter, ...events: string[]): void =>
  events.forEach((event) => source.on(event, (...args: unknown[]) => target.emit(event, ...args)));
