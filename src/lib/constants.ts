export const VERSION: string = manifest.VERSION;
export const NAME: string = manifest.NAME;
export const HOMEPAGE: string = manifest.HOMEPAGEURL;
export const RELEASES: string = manifest.RELEASESURL;
export const BUGS: string = manifest.SUPPORTURL;

declare global {
  const manifest: Record<string, string>;
}
