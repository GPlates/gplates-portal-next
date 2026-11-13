import type * as CesiumNS from 'cesium';
import { TILE_SERVER_URL } from './tileServer';
import { gunzip } from './gunzip';
import { DEFAULT_POINT_SCALE, isLonLat, pointImage } from './pointImages';

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

type OverlayFeature = {
  geometry: { type: string; coordinates: unknown } | null;
  properties?: {
    color?: number[];
    width?: number;
    scale?: number;
    shape?: string;
    /** a text label drawn at a point -- TopoReconView's city names */
    label?: string;
  };
};

export const geoJsonUrl = (name: string, time: number) =>
  `${TILE_SERVER_URL}/GeoJson/${name}/${time}.geojson.gz`;

export async function fetchGeoJson<F = OverlayFeature>(name: string, time: number) {
  const response = await fetch(geoJsonUrl(name, time));
  if (!response.ok) {
    throw new Error(`${response.status} fetching ${geoJsonUrl(name, time)}`);
  }
  const text = new TextDecoder().decode(await gunzip(await response.arrayBuffer()));
  return JSON.parse(text) as { features: F[] };
}

/**
 * A non-interactive overlay: lines (coastlines, PaleoDEM's continental-block
 * outlines), points, and any point `label`s (topo_recon's cities). Polygons
 * only appear in clickable layers -- see pickableGeoJson.ts.
 */
export async function loadGeoJsonOverlay(
  Cesium: typeof CesiumNS,
  name: string,
  time: number,
  color: LayerColor,
): Promise<CesiumNS.PrimitiveCollection> {
  const data = await fetchGeoJson(name, time);
  const polylines = new Cesium.PolylineCollection();
  const points = new Cesium.BillboardCollection();
  const labels = new Cesium.LabelCollection();

  const toColor = ([r, g, b, a = 1]: number[]) => new Cesium.Color(r, g, b, a);

  const addLine = (coords: number[][], feature: OverlayFeature) => {
    if (coords.length < 2) return;
    const material = Cesium.Material.fromType('Color');
    material.uniforms.color = toColor(feature.properties?.color ?? color);
    polylines.add({
      positions: Cesium.Cartesian3.fromDegreesArray(coords.flatMap(([lon, lat]) => [lon, lat])),
      material,
      width: feature.properties?.width ?? DEFAULT_LINE_WIDTH,
    });
  };

  const addPoint = (coords: unknown, feature: OverlayFeature) => {
    if (!isLonLat(coords)) return;
    const [lon, lat] = coords;
    const position = Cesium.Cartesian3.fromDegrees(lon, lat);
    const props = feature.properties ?? {};
    points.add({
      image: pointImage(props.shape),
      position,
      // createPrimitives fell back to black for points, not the layer colour
      color: toColor(props.color ?? [0, 0, 0, 1]),
      scale: props.scale ?? DEFAULT_POINT_SCALE,
      scaleByDistance: new Cesium.NearFarScalar(1.5e4, 1.5, 1.5e7, 0.4),
    });
    if (props.label) {
      // TopoReconView.drawCityLabel
      labels.add({
        position,
        text: props.label,
        font: '20px sans-serif',
        fillColor: Cesium.Color.BLUE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      });
    }
  };

  for (const feature of data.features) {
    const geometry = feature.geometry;
    if (!geometry) continue;
    if (geometry.type === 'LineString') {
      addLine(geometry.coordinates as number[][], feature);
    } else if (geometry.type === 'MultiLineString') {
      (geometry.coordinates as number[][][]).forEach((part) => addLine(part, feature));
    } else if (geometry.type === 'Point') {
      addPoint(geometry.coordinates, feature);
    } else if (geometry.type === 'MultiPoint') {
      (geometry.coordinates as unknown[]).forEach((p) => addPoint(p, feature));
    }
  }

  const collection = new Cesium.PrimitiveCollection();
  collection.add(polylines);
  collection.add(points);
  collection.add(labels);
  return collection;
}
