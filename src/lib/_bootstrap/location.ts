export {};

type Path = string | RegExp;

const match = (...needle: [Path, ...Path[]]): boolean => {
  const { pathname: current } = location;

  return !!needle.find((p: Path) => (typeof p === 'string' ? p === current : p.test(current)));
};

declare global {
  interface Location {
    match: typeof match;
  }
}

Object.assign(location, {
  match,
});
