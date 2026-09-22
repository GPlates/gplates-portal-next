// Base URL of the static tile server that hosts the pre-cut raster/terrain
// tile pyramids (directories "raster_tiles/" and "terrain_tiles/" served as
// plain static files). Override with NEXT_PUBLIC_TILE_SERVER_URL to point at a
// local tile server instead -- see scripts/serve_tiles_cors.py.
export const TILE_SERVER_URL = (
  process.env.NEXT_PUBLIC_TILE_SERVER_URL || 'https://repo.gplates.org/webdav/gplates-portal-data/'
).replace(/\/$/, '');
