import { match } from './fn/match';

declare global {
  interface Location {
    match: typeof match;
  }

  type Path = string | RegExp;
}

location.match = match;
