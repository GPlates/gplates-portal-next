/**
 * Base URL of the GPlates Web Service. Override with NEXT_PUBLIC_GWS_URL, e.g.
 * to point at a local GWS during development.
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
