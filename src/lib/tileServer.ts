// Base URL of the static data server. It started out holding only the pre-cut
// raster/terrain tile pyramids ("raster_tiles/", "terrain_tiles/"), which is
// where the name comes from, and now also serves "GeoJson/", "Animations/" and
// the ExRidges HTML tree -- everything the portal reads as plain static files.
//
// The single base URL for all of them, the way GWS_URL is for the web service;
// nothing else should declare its own. It carries no trailing slash, so call
// sites append a path beginning with "/".
//
// Override with NEXT_PUBLIC_TILE_SERVER_URL to point at a local server
// instead -- see scripts/serve_tiles_cors.py.
export const TILE_SERVER_URL = (
  process.env.NEXT_PUBLIC_TILE_SERVER_URL || 'https://repo.gplates.org/webdav/gplates-portal-data/'
).replace(/\/$/, '');
