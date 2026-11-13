/**
 * Some datasets link into static pages that only exist on the old Django portal
 * (e.g. the ~250 MB of ExRidges per-ridge HTML pages under
 * /static/html/ExRidges/), too big to copy into public/. Until they get a home
 * of their own, site-relative links in feature data resolve against the live
 * old portal. Override with NEXT_PUBLIC_LEGACY_PORTAL_URL.
 */
export const LEGACY_PORTAL_URL = (
  process.env.NEXT_PUBLIC_LEGACY_PORTAL_URL || 'https://portal.gplates.org'
).replace(/\/$/, '');

export const legacyPortalUrl = (url: string) =>
  /^https?:\/\//.test(url) ? url : `${LEGACY_PORTAL_URL}${url.startsWith('/') ? '' : '/'}${url}`;
