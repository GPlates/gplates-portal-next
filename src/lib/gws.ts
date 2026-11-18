/**
 * Client for the GPlates Web Service.
 *
 * GWS_URL is the single base URL for the whole project -- the cesium viewer's
 * raster query, /service/reconstruct_file, /service/d3_demo and the /map
 * coastline and city layers all build their URLs from it. Nothing else should
 * declare its own; it carries no trailing slash, so call sites append a path
 * beginning with "/".
 *
 * Override with NEXT_PUBLIC_GWS_URL to point at a local GWS during
 * development (this replaces the commented-out localhost line that used to sit
 * in src/app/map/gSettings.ts).
 */
export const GWS_URL = (process.env.NEXT_PUBLIC_GWS_URL || 'https://gws.gplates.org').replace(/\/$/, '');

/**
 * The value of a GWS-hosted raster at a point (the old
 * CesiumView.addRasterQueryLeftClickHandler). GWS answers with the bare value
 * as text.
 */
export async function queryRaster(rasterName: string, lon: number, lat: number) {
  const params = new URLSearchParams({
    lon: lon.toFixed(2),
    lat: lat.toFixed(2),
    raster_name: rasterName,
  });
  const response = await fetch(`${GWS_URL}/raster/query?${params}`);
  if (!response.ok) throw new Error(`${response.status} from GWS raster/query`);
  return (await response.text()).trim();
}
