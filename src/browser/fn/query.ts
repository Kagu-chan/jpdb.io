import { queryToObject } from './query-to-object';

export const query = <T extends string | string[]>(key: string): T | undefined => {
  const s = location.search?.replace('?', '');

  if (!s?.length) {
    return;
  }

  const queryMap = queryToObject(s);

  return queryMap[key] as T;
};
