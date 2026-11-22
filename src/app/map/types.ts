import type { GeoProjection } from 'd3';
import type { RefObject } from 'react';

/** the map's current projection; both are null until the SVG has a size */
export type MapProjection = { name: string | null; proj: GeoProjection | null };

/** a MapProjection that has been set up */
export type ReadyProjection = { name: string; proj: GeoProjection };

export type SvgRef = RefObject<SVGSVGElement | null>;

/**
 * Data bound to the drawn points, so zoom and drag can re-project them:
 * a globe point is a small circle polygon ([lon, lat, radius in degrees]), a
 * flat-map point an SVG circle ([lon, lat]), and a label [lon, lat, text].
 */
export type PathPointDatum = [number, number, number];
export type CirclePointDatum = [number, number];
export type LabelDatum = [number, number, string];

export const isReady = (p: MapProjection): p is ReadyProjection => p.name != null && p.proj != null;

/** screen x/y of a lon/lat, as the old code's proj(d)[0] / proj(d)[1] */
export const projectX = (proj: GeoProjection, d: [number, number, ...unknown[]]) => proj([d[0], d[1]])![0];
export const projectY = (proj: GeoProjection, d: [number, number, ...unknown[]]) => proj([d[0], d[1]])![1];

/** one entry of https://repo.gplates.org/webdav/pmm/models.json, keyed by lower-case model name */
export type ModelListEntry = {
  description: string;
  Rotations: string;
  Layers: Record<string, string>;
};
export type ModelList = Record<string, ModelListEntry>;
