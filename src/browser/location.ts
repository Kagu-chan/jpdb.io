import { match } from './fn/match';
import { query } from './fn/query';
import { queryToObject } from './fn/query-to-object';

declare global {
  interface Location {
    match: typeof match;
    query: typeof query;
    queryToObject: typeof queryToObject;
  }

  type Path = string | RegExp;
}

location.match = match;
location.query = query;
location.queryToObject = queryToObject;
