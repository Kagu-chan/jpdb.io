export function getRefFor(text: string, filter?: string): string {
  const { search } = location;
  const match = search.match(/id=([\w\d]+)/i);
  const [, id] = match ?? [, 'global'];

  return `<a href="/deck?id=${id}${filter ? `&show_only=${filter}` : ''}">${text}</a>`;
}
