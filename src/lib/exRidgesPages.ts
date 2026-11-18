import { TILE_SERVER_URL } from './tileServer';

/**
 * The ExRidges per-ridge summary pages: ~250 MB of legacy HTML, images and
 * profiles that used to exist only on the old Django portal under
 * /static/html/ExRidges/. As of 2026-11-18 they sit on the data server beside
 * the tiles, at {TILE_SERVER_URL}/ExRidges/, with the same internal layout --
 * so nothing here depends on the old portal any more, and
 * NEXT_PUBLIC_LEGACY_PORTAL_URL is gone with it.
 *
 * Two callers: the /portal/ExRidges index, which knows the file names, and the
 * cesium feature info panel, whose links come from the layer data and still
 * carry the old site-relative paths.
 */
const OLD_PREFIX = '/static/html/ExRidges/';

export const EX_RIDGES_BASE = `${TILE_SERVER_URL}/ExRidges`;

/** a summary page by file name, e.g. "1-01_Aegir_Ridge.html" */
export const exRidgesPageUrl = (fileName: string) =>
  `${EX_RIDGES_BASE}/ExRidges_HTML_pages/${fileName}`;

/**
 * Rewrite a path out of the ExRidges layer data onto the data server. Every
 * URL property in that layer (398 features, 93 distinct) is of the form
 * /static/html/ExRidges/ExRidges_HTML_pages/*.html, and no other pickable
 * layer sets URL at all, so anything site-relative is treated as living in
 * that tree.
 */
export const exRidgesAssetUrl = (url: string) => {
  if (/^https?:\/\//.test(url)) return url;
  const path = url.startsWith(OLD_PREFIX)
    ? url.slice(OLD_PREFIX.length)
    : url.replace(/^\//, '');
  return `${EX_RIDGES_BASE}/${path}`;
};
