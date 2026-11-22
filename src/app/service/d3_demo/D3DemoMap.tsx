'use client';

import * as d3 from 'd3';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GWS_URL } from '../../../lib/gws';

export type DemoView = 'coastlines' | 'points' | 'feature_collection';

/** the old template's fixed canvas */
const WIDTH = 960;
const HEIGHT = 500;

/** the six sample locations the old page shipped with */
const DEFAULT_LOCATIONS = [
  { lon: '116', lat: '39' },
  { lon: '151', lat: '-33' },
  { lon: '37', lat: '55' },
  { lon: '-74', lat: '40' },
  { lon: '-43', lat: '-22' },
  { lon: '18', lat: '14' },
];

const DEFAULT_FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [128, -17],
            [133, -18],
            [138, -19],
            [140, -23],
            [139, -27],
            [130, -27],
            [128, -24],
            [127, -21],
            [127, -17],
            [128, -17],
          ],
        ],
      },
      properties: {},
    },
  ],
};

const baseScale = (name: string) =>
  name === 'orthographic' ? (WIDTH - 1) / 4 : (WIDTH - 1) / 2 / Math.PI;

const makeProjection = (name: string): d3.GeoProjection =>
  name === 'orthographic'
    ? d3
        .geoOrthographic()
        .scale(baseScale(name))
        .translate([WIDTH / 2, HEIGHT / 2])
        .clipAngle(90)
        .precision(0.1)
    : d3
        .geoEquirectangular()
        .scale(baseScale(name))
        .rotate([0.1, 0, 0])
        .translate([WIDTH / 2, HEIGHT / 2])
        .precision(0.1);

type Layers = {
  coastlines: d3.Selection<SVGGElement, unknown, null, undefined>;
  geometry: d3.Selection<SVGGElement, unknown, null, undefined>;
  graticule: d3.Selection<SVGGElement, unknown, null, undefined>;
};

export function D3DemoMap({ view }: { view: DemoView }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const layersRef = useRef<Layers | null>(null);
  const projectionRef = useRef<d3.GeoProjection>(makeProjection('equirectangular'));
  /** reconstructed [lon, lat] pairs, redrawn whenever the projection changes */
  const pointsRef = useRef<[number, number][]>([]);

  const [projName, setProjName] = useState('equirectangular');
  /**
   * the zoom and drag handlers are installed once and outlive any projection
   * change, so they read the current projection's name from here rather than
   * closing over the state
   */
  const projNameRef = useRef(projName);
  useEffect(() => {
    projNameRef.current = projName;
  }, [projName]);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [time, setTime] = useState('140');
  const [timeLabel, setTimeLabel] = useState('140');
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [paleoLocations, setPaleoLocations] = useState<{ lon: string; lat: string }[]>([]);
  const [featureCollection, setFeatureCollection] = useState(() =>
    JSON.stringify(DEFAULT_FEATURE_COLLECTION, undefined, 4),
  );
  const [requestUrl, setRequestUrl] = useState('');
  const [rawData, setRawData] = useState('');

  const path = useCallback(() => d3.geoPath().projection(projectionRef.current), []);

  /** reposition everything already drawn after a projection, zoom or rotate change */
  const redraw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    const projection = projectionRef.current;
    svg.selectAll<SVGPathElement, unknown>('path').attr('d', path() as never);
    svg
      .selectAll<SVGCircleElement, [number, number]>('circle.pathPoint')
      .attr('cx', (d) => projection(d)?.[0] ?? 0)
      .attr('cy', (d) => projection(d)?.[1] ?? 0);
  }, [path]);

  const drawPoint = useCallback(
    (lon: number, lat: number) => {
      const layers = layersRef.current;
      if (!layers) return;
      const projection = projectionRef.current;

      if (projNameRef.current === 'orthographic') {
        layers.geometry
          .append('path')
          .datum(d3.geoCircle().center([lon, lat]).radius(1).precision(10)())
          .attr('d', path() as never)
          .attr('class', 'pathPoint')
          .append('svg:title')
          .text(`Longitude: ${lon}\nLatitude: ${lat}`);
      } else {
        layers.geometry
          .append('circle')
          .datum<[number, number]>([lon, lat])
          .attr('cx', (d) => projection(d)?.[0] ?? 0)
          .attr('cy', (d) => projection(d)?.[1] ?? 0)
          .attr('r', 3)
          .attr('class', 'pathPoint')
          .append('svg:title')
          .text(`Longitude: ${lon}\nLatitude: ${lat}`);
      }
    },
    [path],
  );

  const loadCoastlines = useCallback(
    async (atTime: string) => {
      const layers = layersRef.current;
      if (!layers) return;
      // The old template appended an apikey here; it is unused, and /map's
      // drawCoastlines already calls this endpoint without one.
      const url = `${GWS_URL}/reconstruct/coastlines_low/?time=${atTime}&avoid_map_boundary`;
      const topology = (await d3.json(url)) as GeoJSON.FeatureCollection | undefined;
      if (!topology?.features) return;

      layers.coastlines.selectAll('.coastline').remove();
      layers.coastlines
        .selectAll('.coastline')
        .data(topology.features)
        .enter()
        .append('path')
        .attr('d', path() as never)
        .attr('class', 'coastline')
        .on('mouseover', function () {
          d3.select(this).style('fill-opacity', 0.7).style('stroke', 'red').style('stroke-width', '1px');
        })
        .on('mouseout', function () {
          d3.select(this).style('fill-opacity', 1).style('stroke', 'grey').style('stroke-width', '.25px');
        });
      return url;
    },
    [path],
  );

  const loadPoints = useCallback(
    async (atTime: string) => {
      const layers = layersRef.current;
      if (!layers) return;
      const lons = locations.map((l) => l.lon).join(',');
      const lats = locations.map((l) => l.lat).join(',');
      const url = `${GWS_URL}/reconstruct/reconstruct_points/?lats=${lats}&lons=${lons}&time=${atTime}`;
      setRequestUrl(url);

      const data = (await d3.json(url)) as { coordinates: [number, number][] } | undefined;
      if (!data?.coordinates) return;
      setRawData(JSON.stringify(data, undefined, 4));
      setPaleoLocations(data.coordinates.map(([lon, lat]) => ({ lon: String(lon), lat: String(lat) })));

      layers.geometry.selectAll('*').remove();
      pointsRef.current = data.coordinates.map(([lon, lat]) => [lon, lat]);
      pointsRef.current.forEach(([lon, lat]) => drawPoint(lon, lat));
    },
    [drawPoint, locations],
  );

  const loadFeatureCollection = useCallback(
    async (atTime: string) => {
      const layers = layersRef.current;
      if (!layers) return;
      // the old page stripped every space out of the whole URL; stripping it
      // from the JSON before encoding has the same effect and stays valid
      const collection = featureCollection.replace(/\s+/g, '');
      const url = `${GWS_URL}/reconstruct/reconstruct_feature_collection/?feature_collection=${encodeURIComponent(
        collection,
      )}&time=${atTime}`;
      setRequestUrl(url);

      let data: GeoJSON.FeatureCollection | undefined;
      try {
        data = (await d3.json(url)) as GeoJSON.FeatureCollection | undefined;
      } catch {
        data = undefined;
      }
      if (!data?.features?.length) {
        window.alert('error. check the geojson request.');
        return;
      }
      setRawData(JSON.stringify(data, undefined, 4));

      layers.geometry.selectAll('*').remove();
      pointsRef.current = [];
      const first = data.features[0].geometry;
      if (first.type === 'Point') {
        data.features.forEach((f) => {
          const c = (f.geometry as GeoJSON.Point).coordinates;
          pointsRef.current.push([c[0], c[1]]);
          drawPoint(c[0], c[1]);
        });
      } else if (first.type === 'MultiPoint') {
        data.features.forEach((f) => {
          (f.geometry as GeoJSON.MultiPoint).coordinates.forEach((c) => {
            pointsRef.current.push([c[0], c[1]]);
            drawPoint(c[0], c[1]);
          });
        });
      } else {
        layers.geometry
          .selectAll('*')
          .data(data.features)
          .enter()
          .append('path')
          .attr('d', path() as never)
          .attr('class', 'RG')
          .attr('stroke', 'yellow');
      }
    },
    [drawPoint, featureCollection, path],
  );

  const refresh = useCallback(async () => {
    setTimeLabel(time);
    const coastlineUrl = await loadCoastlines(time);
    if (view === 'points') {
      await loadPoints(time);
    } else if (view === 'feature_collection') {
      await loadFeatureCollection(time);
    } else if (coastlineUrl) {
      setRequestUrl(coastlineUrl);
    }
  }, [loadCoastlines, loadFeatureCollection, loadPoints, time, view]);

  /* set up the three layers, the graticule, and the zoom/drag behaviours once */
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    layersRef.current = {
      coastlines: svg.append('g'),
      geometry: svg.append('g'),
      graticule: svg.append('g'),
    };
    layersRef.current.graticule
      .append('path')
      .datum(d3.geoGraticule()())
      .attr('class', 'graticule')
      .attr('d', path() as never);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        const projection = projectionRef.current;
        projection.scale(baseScale(projNameRef.current) * event.transform.k);
        if (projNameRef.current !== 'orthographic') {
          projection.translate([
            WIDTH / 2 + event.transform.x,
            HEIGHT / 2 + event.transform.y,
          ]);
        }
        redraw();
      });
    zoomRef.current = zoom;

    const drag = d3.drag<SVGSVGElement, unknown>().on('drag', (event) => {
      if (projNameRef.current !== 'orthographic') return;
      const projection = projectionRef.current;
      const sensitivity = 75;
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
      redraw();
    });

    svg.call(zoom).call(drag);

    return () => {
      svg.on('.zoom', null).on('.drag', null);
    };
    // every dependency here is stable, so this runs once: the layers and the
    // behaviours must survive a projection change, or the coastlines already
    // fetched would be wiped with no refetch
  }, [path, redraw]);

  /*
   * A projection change swaps the projection and redraws what is already on
   * screen -- the coastline paths stay, the points are rebuilt because their
   * shape differs between the two projections.
   */
  useEffect(() => {
    projectionRef.current = makeProjection(projName);
    const layers = layersRef.current;
    if (!layers) return;
    if (zoomRef.current && svgRef.current) {
      // back to 1x, so the new projection starts at its own base scale
      d3.select(svgRef.current).call(zoomRef.current.transform, d3.zoomIdentity);
    }
    layers.geometry.selectAll('*').remove();
    pointsRef.current.forEach(([lon, lat]) => drawPoint(lon, lat));
    redraw();
  }, [drawPoint, projName, redraw]);

  /* initial load, as the old page did on $(document).ready */
  useEffect(() => {
    // Fetching on mount is what effects are for; the rule objects only
    // because refresh() also sets the time label synchronously, which is
    // already that value on first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    // only on mount -- afterwards the Refresh Map button drives it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocation = (index: number, key: 'lon' | 'lat', value: string) =>
    setLocations((prev) => prev.map((l, i) => (i === index ? { ...l, [key]: value } : l)));

  return (
    <div className="d3-demo">
      <h1 className="d3-demo-time">{timeLabel} Ma</h1>

      <div className="d3-demo-canvas">
        <svg ref={svgRef} width={WIDTH} height={HEIGHT} />
      </div>

      <div className="d3-demo-controls">
        <div className="d3-demo-row">
          <label htmlFor="recon-time">Time:</label>
          <input
            id="recon-time"
            type="number"
            min="0"
            step="1"
            max="550"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <label htmlFor="select-projection">Projection:</label>
          <select
            id="select-projection"
            value={projName}
            onChange={(e) => setProjName(e.target.value)}
          >
            <option value="orthographic">Orthographic</option>
            <option value="equirectangular">Rectangular</option>
          </select>
        </div>

        {view === 'points' && (
          <div className="d3-demo-locations">
            {locations.map((location, index) => (
              <div className="d3-demo-location" key={index}>
                <label className="d3-demo-location-name">Location {index + 1}:</label>
                <label>Longitude:</label>
                <input
                  value={location.lon}
                  onChange={(e) => setLocation(index, 'lon', e.target.value)}
                  className="d3-demo-coord"
                />
                <label>Latitude:</label>
                <input
                  value={location.lat}
                  onChange={(e) => setLocation(index, 'lat', e.target.value)}
                  className="d3-demo-coord"
                />
                <label>Paleo-Longitude:</label>
                <input value={paleoLocations[index]?.lon ?? ''} className="d3-demo-paleo" disabled />
                <label>Paleo-Latitude:</label>
                <input value={paleoLocations[index]?.lat ?? ''} className="d3-demo-paleo" disabled />
              </div>
            ))}
          </div>
        )}

        {view === 'feature_collection' && (
          <div className="d3-demo-row">
            <textarea
              rows={14}
              cols={100}
              value={featureCollection}
              onChange={(e) => setFeatureCollection(e.target.value)}
            />
          </div>
        )}

        <div>
          <input type="button" value="Refresh Map" onClick={() => void refresh()} />
        </div>
      </div>

      {requestUrl && (
        <div className="d3-demo-output">
          <strong>Request URL:</strong>
          <br />
          <a href={requestUrl} target="_blank" rel="noreferrer">
            {requestUrl}
          </a>
        </div>
      )}

      {rawData && (
        <div className="d3-demo-output">
          <strong>Returned Raw Data:</strong>
          <pre>{rawData}</pre>
        </div>
      )}
    </div>
  );
}
