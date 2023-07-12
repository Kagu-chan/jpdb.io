import { match } from './fn/match';

declare global {
  interface Location {
    match: typeof match;
  }
}

location.match = match;
