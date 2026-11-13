import type * as CesiumNS from 'cesium';
import { LayerColor, fetchGeoJson } from './geoJson';
import { DEFAULT_POINT_SCALE, isLonLat, pointImage } from './pointImages';

/**
 * Port of the clickable-feature half of the old static/js/cesium/GeoJsonLayer.js,
 * Utils.createPrimitives() and CesiumView's focusFeature/clearSelectedFeatures.
 *
 * Unlike the plain coastline overlays in geoJson.ts, every feature here keeps its
 * GeoJSON properties and is tagged as the Cesium pick `id` of everything drawn for
 * it, so scene.pick()/drillPick() lead straight back to the feature.
 *
 * Geometry handled: LineString, MultiLineString (the ExRidges view), Polygon,
 * MultiPolygon (contourites) and Point, MultiPoint (Biosphere's sample sites).
 */

export type FeatureProperties = Record<string, unknown> & {
  name?: string;
  ID?: string | number;
  URL?: string | null;
  color?: number[];
  width?: number;
};

type Feature = {
  geometry: { type: string; coordinates: unknown } | null;
  properties: FeatureProperties | null;
};

/** what the old Utils.createLineString fell back to */
const DEFAULT_LINE_COLOR: LayerColor = [1, 1, 1, 1];
const DEFAULT_LINE_WIDTH = 0.5;
/** the old createPolygon: a red grid fill at 30% over a black outline */
const POLYGON_FILL_COLOR: LayerColor = [1, 0, 0, 1];
const POLYGON_OUTLINE_COLOR: LayerColor = [0, 0, 0, 1];
const HIGHLIGHT_OUTLINE_COLOR: LayerColor = [1, 1, 1, 1];

export class PickableFeature {
  /** the polylines drawn for this feature (lines, or a polygon's outline) */
  readonly polylines: CesiumNS.Polyline[] = [];
  /** the markers drawn for a point feature */
  readonly billboards: CesiumNS.Billboard[] = [];

  constructor(
    readonly layerName: string,
    readonly properties: FeatureProperties,
    /** one array per line or polygon ring; a single position per point */
    readonly rings: CesiumNS.Cartesian3[][],
    readonly color: LayerColor,
    readonly width: number,
    readonly isPolygon: boolean,
    /** base marker scale, for points */
    readonly scale = 1,
  ) {}

  get name() {
    const name = this.properties.name;
    return typeof name === 'string' ? name.trim() : '';
  }

  /** the old code only treated features with both a name and an ID as pickable */
  get isNamed() {
    const id = this.properties.ID;
    return this.name.length > 0 && id !== undefined && id !== null && String(id).length > 0;
  }

  get key() {
    return `${this.layerName}:${this.properties.ID}`;
  }
}

export type PickableLayer = {
  features: PickableFeature[];
  /** add everything to the scene */
  addTo: (scene: CesiumNS.Scene) => void;
  removeFrom: (scene: CesiumNS.Scene) => void;
  /** free a layer that was never added to a scene */
  destroy: () => void;
  /** show/hide line features; polygons have no per-feature visibility filter yet */
  setVisible: (predicate: (feature: PickableFeature) => boolean) => void;
  highlight: (feature: PickableFeature | null) => void;
};

const toColor = (Cesium: typeof CesiumNS, [r, g, b, a = 1]: number[]) =>
  new Cesium.Color(r, g, b, a);

const toPositions = (Cesium: typeof CesiumNS, coords: number[][]) =>
  Cesium.Cartesian3.fromDegreesArray(coords.flatMap(([lon, lat]) => [lon, lat]));

export async function loadPickableLayer(
  Cesium: typeof CesiumNS,
  names: string[],
  time = 0,
): Promise<PickableLayer> {
  const layers = await Promise.all(
    names.map(async (name) => ({ name, data: await fetchGeoJson<Feature>(name, time) })),
  );

  const lines = new Cesium.PolylineCollection();
  const highlightLines = new Cesium.PolylineCollection();
  const polygonInstances: CesiumNS.GeometryInstance[] = [];
  const points = new Cesium.BillboardCollection();
  const features: PickableFeature[] = [];

  const addPolyline = (feature: PickableFeature, positions: CesiumNS.Cartesian3[], color: LayerColor, width: number) => {
    const material = Cesium.Material.fromType('Color', { color: toColor(Cesium, color) });
    feature.polylines.push(lines.add({ positions, material, width, id: feature }));
  };

  for (const { name, data } of layers) for (const f of data.features) {
    if (!f.geometry || !f.properties) continue;
    const props = f.properties;
    const { type, coordinates } = f.geometry;

    if (type === 'LineString' || type === 'MultiLineString') {
      const parts = (type === 'LineString' ? [coordinates] : coordinates) as number[][][];
      const rings = parts.filter((p) => p.length >= 2).map((p) => toPositions(Cesium, p));
      const color = (props.color as LayerColor | undefined) ?? DEFAULT_LINE_COLOR;
      const width = props.width ?? DEFAULT_LINE_WIDTH;
      const feature = new PickableFeature(name, props, rings, color, width, false);
      rings.forEach((r) => addPolyline(feature, r, color, width));
      features.push(feature);
    } else if (type === 'Polygon' || type === 'MultiPolygon') {
      const polygons = (type === 'Polygon' ? [coordinates] : coordinates) as number[][][][];
      const rings: CesiumNS.Cartesian3[][] = [];
      const feature = new PickableFeature(name, props, rings, POLYGON_OUTLINE_COLOR, 1, true);
      for (const polygon of polygons) {
        const [outer, ...holes] = polygon.map((ring) => toPositions(Cesium, ring));
        if (!outer || outer.length < 3) continue;
        rings.push(outer, ...holes);
        polygonInstances.push(
          new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(
                outer,
                // the old createPolygonHierarchy tried holes.append(), which
                // would have thrown on any polygon that had one
                holes.map((h) => new Cesium.PolygonHierarchy(h)),
              ),
              vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            }),
            id: feature,
          }),
        );
      }
      rings.forEach((r) => addPolyline(feature, r, POLYGON_OUTLINE_COLOR, 1));
      features.push(feature);
    } else if (type === 'Point' || type === 'MultiPoint') {
      const all = (type === 'Point' ? [coordinates] : coordinates) as unknown[];
      const coords = all.filter(isLonLat);
      if (coords.length < all.length) {
        console.warn(`${name}: skipping a point with unusable coordinates`, props.name, all);
      }
      if (coords.length === 0) continue;
      const positions = coords.map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));
      // createPrimitives fell back to black for points
      const color = (props.color as LayerColor | undefined) ?? ([0, 0, 0, 1] as LayerColor);
      const scale = typeof props.scale === 'number' ? props.scale : DEFAULT_POINT_SCALE;
      const feature = new PickableFeature(name, props, positions.map((p) => [p]), color, 1, false, scale);
      for (const position of positions) {
        feature.billboards.push(
          points.add({
            image: pointImage(props.shape),
            position,
            color: toColor(Cesium, color),
            scale,
            scaleByDistance: new Cesium.NearFarScalar(1.5e4, 1.5, 1.5e7, 0.4),
            id: feature,
          }),
        );
      }
      features.push(feature);
    }
  }

  let highlighted: PickableFeature | null = null;

  // one batched primitive for every polygon fill; each instance keeps its
  // feature as its pick id
  const fills =
    polygonInstances.length > 0
      ? new Cesium.Primitive({
          geometryInstances: polygonInstances,
          appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: Cesium.Material.fromType('Grid', {
              color: toColor(Cesium, POLYGON_FILL_COLOR),
              cellAlpha: 0.3,
            }),
            flat: true,
          }),
        })
      : null;

  return {
    features,
    addTo(scene) {
      if (fills) scene.primitives.add(fills);
      scene.primitives.add(lines);
      scene.primitives.add(highlightLines);
      scene.primitives.add(points);
    },
    removeFrom(scene) {
      // PrimitiveCollection destroys what it removes by default
      if (fills) scene.primitives.remove(fills);
      scene.primitives.remove(lines);
      scene.primitives.remove(highlightLines);
      scene.primitives.remove(points);
    },
    destroy() {
      fills?.destroy();
      lines.destroy();
      highlightLines.destroy();
      points.destroy();
    },
    setVisible(predicate) {
      for (const feature of features) {
        if (feature.isPolygon) continue;
        const show = predicate(feature);
        feature.polylines.forEach((p) => (p.show = show));
        feature.billboards.forEach((b) => (b.show = show));
      }
    },
    highlight(feature) {
      highlightLines.removeAll();
      highlighted?.billboards.forEach((b) => (b.scale = highlighted!.scale));
      highlighted = feature;
      if (!feature) return;
      if (feature.billboards.length > 0) {
        // the old focusFeature doubled a point's scale
        feature.billboards.forEach((b) => (b.scale = feature.scale * 2));
        return;
      }
      // the old focusFeature doubled the line width and gave it an outline
      const color = feature.isPolygon ? ([1, 1, 0, 1] as LayerColor) : feature.color;
      const width = Math.max(feature.width * 2, 3);
      for (const positions of feature.rings) {
        highlightLines.add({
          positions,
          width: width + 2,
          id: feature,
          material: Cesium.Material.fromType('PolylineOutline', {
            color: toColor(Cesium, color),
            outlineColor: toColor(Cesium, HIGHLIGHT_OUTLINE_COLOR),
            outlineWidth: 1,
          }),
        });
      }
    },
  };
}

/** the feature behind a scene.pick()/drillPick() result, if it is one of ours */
export const pickedFeature = (picked: unknown): PickableFeature | null => {
  const id = (picked as { id?: unknown } | undefined)?.id;
  return id instanceof PickableFeature && id.isNamed ? id : null;
};

/** the old CesiumView.refreshInfoPanel never listed these */
const EXCLUDED_PROPERTIES = new Set([
  'color',
  'width',
  'URL',
  'scale',
  'fill_polygon',
  'GeometryType',
  // point styling
  'shape',
  'label',
]);

/**
 * Rows for the info panel. With `fields`, only those properties, in that order,
 * under those labels (ExRidgesView's nameMap); otherwise every property bar the
 * styling ones and the name/ID, which are already in the panel title.
 */
export function infoRows(
  properties: FeatureProperties,
  fields?: Record<string, string>,
): [string, string][] {
  const fmt = (v: unknown) => (typeof v === 'number' ? String(v) : String(v ?? ''));
  if (fields) {
    return Object.entries(fields)
      .filter(([key]) => Object.prototype.hasOwnProperty.call(properties, key) && properties[key] !== null)
      .map(([key, label]) => [label, fmt(properties[key])]);
  }
  return Object.entries(properties)
    .filter(([key, v]) => !EXCLUDED_PROPERTIES.has(key) && key !== 'name' && key !== 'ID' && v !== null)
    .map(([key, v]) => [key, fmt(v)]);
}
