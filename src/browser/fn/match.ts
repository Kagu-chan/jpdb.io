type Path = string | RegExp;

export const match = (...needle: [Path, ...Path[]]): boolean => {
  const { pathname: current } = location;

  return !!needle.find((p: Path) => (typeof p === 'string' ? p === current : p.test(current)));
};
