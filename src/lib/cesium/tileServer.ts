// Base URL of the static tile server that hosts the pre-cut raster/terrain
// tile pyramids (directories "raster_tiles/" and "terrain_tiles/" served as
// plain static files). Defaults to the local dev tile server; override with
// NEXT_PUBLIC_TILE_SERVER_URL for other environments.
export const TILE_SERVER_URL = (
  process.env.NEXT_PUBLIC_TILE_SERVER_URL || 'http://localhost:8000'
).replace(/\/$/, '');
