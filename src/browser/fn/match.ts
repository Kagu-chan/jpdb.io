export const match = (...needle: Path[]): boolean => {
  const { pathname: current } = location;

  return !!needle.find((p: Path) => (typeof p === 'string' ? p === current : p.test(current)));
};
