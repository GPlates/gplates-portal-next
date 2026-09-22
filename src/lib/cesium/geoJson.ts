import type * as CesiumNS from 'cesium';
import { TILE_SERVER_URL } from './tileServer';
import { gunzip } from './gunzip';

/**
 * Port of the vector-overlay half of the old static/js/cesium/GeoJsonLayer.js
 * and Utils.createPrimitives().
 *
 * The old app fetched these through a Django view (/get_geojson/); here the
 * .geojson.gz files are read straight off the static tile server, laid out as
 * GeoJson/{name}/{time}.geojson.gz. Present-day layers only have a 0 file,
 * reconstruction layers have one per frame.
 */

/** rgba, each component 0..1 -- the shape the old GeoJSON properties used */
export type LayerColor = [number, number, number, number];

/** GeoJsonLayer.js defaulted to yellow, and createLineString to width 0.5 */
export const DEFAULT_LAYER_COLOR: LayerColor = [1.0, 1.0, 0.0, 1.0];
const DEFAULT_LINE_WIDTH = 0.5;

type LineFeature = {
  geometry: { type: string; coordinates: number[][] | number[][][] };
  properties?: { color?: LayerColor; width?: number };
};

export const geoJsonUrl = (name: string, time: number) =>
  `${TILE_SERVER_URL}/GeoJson/${name}/${time}.geojson.gz`;

async function fetchGeoJson(name: string, time: number) {
  const response = await fetch(geoJsonUrl(name, time));
  if (!response.ok) {
    throw new Error(`${response.status} fetching ${geoJsonUrl(name, time)}`);
  }
  const text = new TextDecoder().decode(await gunzip(await response.arrayBuffer()));
  return JSON.parse(text) as { features: LineFeature[] };
}

/**
 * Only LineString/MultiLineString are handled, which is every overlay currently
 * configured (the coastlines). The old Utils.createPrimitives also built
 * polygons and billboard points, for views that aren't ported yet.
 */
export async function loadGeoJsonLines(
  Cesium: typeof CesiumNS,
  name: string,
  time: number,
  color: LayerColor,
): Promise<CesiumNS.PolylineCollection> {
  const data = await fetchGeoJson(name, time);
  const ellipsoid = Cesium.Ellipsoid.WGS84;
  const polylines = new Cesium.PolylineCollection();

  const addLine = (coords: number[][], feature: LineFeature) => {
    if (coords.length < 2) return;
    const positions = ellipsoid.cartographicArrayToCartesianArray(
      coords.map(([lon, lat]) => Cesium.Cartographic.fromDegrees(lon, lat)),
    );
    const [r, g, b, a] = feature.properties?.color ?? color;
    const material = Cesium.Material.fromType('Color');
    material.uniforms.color = new Cesium.Color(r, g, b, a);
    polylines.add({
      positions,
      material,
      width: feature.properties?.width ?? DEFAULT_LINE_WIDTH,
    });
  };

  for (const feature of data.features) {
    if (feature.geometry?.type === 'LineString') {
      addLine(feature.geometry.coordinates as number[][], feature);
    } else if (feature.geometry?.type === 'MultiLineString') {
      for (const part of feature.geometry.coordinates as number[][][]) {
        addLine(part, feature);
      }
    }
  }

  return polylines;
}
