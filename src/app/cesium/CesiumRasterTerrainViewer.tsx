'use client';

import { useEffect, useRef, useState } from 'react';
import type * as CesiumNS from 'cesium';
import { GPlatesImageryProvider } from '../../lib/cesium/GPlatesImageryProvider';
import { GPlatesTerrainProvider } from '../../lib/cesium/GPlatesTerrainProvider';
import { TimeSlider } from './TimeSlider';
import {
  CREDIT,
  TERRAIN_NONE,
  VIEWS,
  RasterCfg,
  ViewCfg,
  ViewName,
  defaultHeightScale,
  defaultRasterName,
  defaultTerrainName,
  getView,
} from './viewConfigs';

const PROJECTIONS = {
  '3D': '3D Globe',
  '2D': '2D Map',
  Columbus: 'Columbus',
} as const;

type Projection = keyof typeof PROJECTIONS;

export function CesiumRasterTerrainViewer({ initialView }: { initialView: ViewName }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumNS.Viewer | null>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const mouseHandlerRef = useRef<CesiumNS.ScreenSpaceEventHandler | null>(null);

  const [projection, setProjection] = useState<Projection>('3D');

  const [viewName, setViewName] = useState<ViewName>(initialView);
  const [rasterName, setRasterName] = useState(() => defaultRasterName(getView(initialView)));
  const [terrainName, setTerrainName] = useState(() => defaultTerrainName(getView(initialView)));
  const [heightScale, setHeightScale] = useState(() =>
    defaultHeightScale(getView(initialView), defaultTerrainName(getView(initialView))),
  );
  // paleo-age in Ma; only meaningful for views that declare a time range
  const [time, setTime] = useState(() => getView(initialView).time?.start ?? 0);

  // the imagery layer currently on screen, plus the ones waiting to be dropped
  // once their replacement has finished loading (see swapImagery)
  const currentLayerRef = useRef<CesiumNS.ImageryLayer | null>(null);
  const staleLayersRef = useRef<CesiumNS.ImageryLayer[]>([]);

  const view: ViewCfg = getView(viewName);
  const raster = view.rasters[rasterName];
  const terrain = terrainName === TERRAIN_NONE ? null : view.terrains[terrainName];
  const hasTerrains = Object.keys(view.terrains).length > 0;

  // create the viewer once
  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let viewer: CesiumNS.Viewer | undefined;

    (async () => {
      const Cesium = await import('cesium');
      if (cancelled || !containerRef.current) return;

      window.CESIUM_BASE_URL = '/cesium/';

      viewer = new Cesium.Viewer(containerRef.current, {
        baseLayerPicker: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        imageryProvider: createImageryProvider(rasterName, raster, view.time ? time : undefined),
      });
      currentLayerRef.current = viewer.imageryLayers.get(0);

      // drop superseded frames only once the globe has caught up, so stepping
      // through a reconstruction doesn't flash the empty globe between frames
      viewer.scene.globe.tileLoadProgressEvent.addEventListener((queued: number) => {
        if (queued > 0 || staleLayersRef.current.length === 0) return;
        for (const layer of staleLayersRef.current.splice(0)) {
          viewer!.imageryLayers.remove(layer, true);
        }
      });
      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(135.0, -25.0, 18000000),
      });

      // matches the old Viewport.js: no starfield/sun/moon/atmosphere/fog for
      // this data-visualization view
      viewer.scene.skyBox = undefined as unknown as CesiumNS.SkyBox;
      viewer.scene.skyAtmosphere = undefined as unknown as CesiumNS.SkyAtmosphere;
      viewer.scene.sun = undefined as unknown as CesiumNS.Sun;
      viewer.scene.moon = undefined as unknown as CesiumNS.Moon;
      viewer.scene.fog.enabled = false;
      // Globe.showGroundAtmosphere defaults to true independently of
      // skyAtmosphere -- without this the globe surface still gets a hazy
      // atmospheric tint near the grazing limb.
      viewer.scene.globe.showGroundAtmosphere = false;
      // where the raster doesn't reach -- most of the globe on an old
      // reconstruction frame -- the old app showed a dark grey base layer
      // rather than Cesium's default blue
      viewer.scene.globe.baseColor = Cesium.Color.DARKGREY;

      applyTerrain(viewer, Cesium, view, terrainName, heightScale);

      // lon/lat readout under the cursor. Written straight to the DOM rather
      // than through state: this fires on every mouse move, and re-rendering
      // the whole panel at pointer frequency would compete with the render loop.
      const scene = viewer.scene;
      const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction((movement: CesiumNS.ScreenSpaceEventHandler.MotionEvent) => {
        if (!coordsRef.current) return;
        const cartesian = scene.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
        if (!cartesian) {
          coordsRef.current.textContent = '';
          return;
        }
        const carto = scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        const lon = Cesium.Math.toDegrees(carto.longitude).toFixed(2);
        const lat = Cesium.Math.toDegrees(carto.latitude).toFixed(2);
        coordsRef.current.textContent = `(Lon: ${lon},  Lat: ${lat})`;
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      mouseHandlerRef.current = handler;

      viewerRef.current = viewer;
    })();

    return () => {
      cancelled = true;
      viewerRef.current = null;
      mouseHandlerRef.current?.destroy();
      mouseHandlerRef.current = null;
      viewer?.destroy();
    };
    // the viewer is only created once; view/raster/terrain/height-scale changes
    // are applied by the effects below via the live viewerRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // swap the imagery layer whenever the view, raster or reconstruction time changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !raster) return;

    const next = viewer.imageryLayers.addImageryProvider(
      createImageryProvider(rasterName, raster, view.time ? time : undefined),
    );
    if (currentLayerRef.current) {
      staleLayersRef.current.push(currentLayerRef.current);
    }
    currentLayerRef.current = next;

    // scrubbing the slider can outrun tile loading; don't let superseded
    // frames pile up while waiting for the globe to settle
    while (staleLayersRef.current.length > 3) {
      viewer.imageryLayers.remove(staleLayersRef.current.shift()!, true);
    }
  }, [rasterName, raster, view.time, time]);

  // swap the terrain provider whenever the view, terrain or height scale changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    import('cesium').then((Cesium) => {
      if (viewerRef.current === viewer) {
        applyTerrain(viewer, Cesium, view, terrainName, heightScale);
      }
    });
  }, [view, terrainName, heightScale]);

  // switching view resets the raster/terrain selections to that view's defaults,
  // the way the old app built a whole new RasterTerrainView
  const changeView = (next: ViewName) => {
    const cfg = getView(next);
    const nextTerrain = defaultTerrainName(cfg);
    setViewName(next);
    setRasterName(defaultRasterName(cfg));
    setTerrainName(nextTerrain);
    setHeightScale(defaultHeightScale(cfg, nextTerrain));
    setTime(cfg.time?.start ?? 0);
    // keep the URL shareable without remounting the viewer, which a router
    // navigation would do
    window.history.replaceState(null, '', `/cesium/?view=${encodeURIComponent(next)}`);
  };

  const changeTerrain = (next: string) => {
    setTerrainName(next);
    setHeightScale(defaultHeightScale(view, next));
  };

  const changeProjection = (next: Projection) => {
    setProjection(next);
    const scene = viewerRef.current?.scene;
    if (!scene) return;
    if (next === '2D') {
      scene.morphTo2D(0.1);
    } else if (next === 'Columbus') {
      scene.morphToColumbusView(0.1);
    } else {
      scene.morphTo3D(0.1);
    }
  };

  return (
    <div className="cesium-view-page">
      <div ref={containerRef} className="cesium-view-container" />

      <div className="cesium-view-topright">
        <div className="cesium-view-projections">
          {Object.entries(PROJECTIONS).map(([key, label]) => (
            <label key={key} htmlFor={`projection-${key}`}>
              <input
                type="radio"
                id={`projection-${key}`}
                name="projection"
                value={key}
                checked={projection === key}
                onChange={() => changeProjection(key as Projection)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="cesium-view-switcher">
          <label htmlFor="select-view">View</label>
          <select
            id="select-view"
            value={viewName}
            onChange={(e) => changeView(e.target.value as ViewName)}
          >
            {Object.entries(VIEWS).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cesium-view-topleft">
        <a
          className="cesium-view-about"
          href={view.aboutUrl}
          {...(view.aboutUrl.startsWith('http')
            ? { target: '_blank', rel: 'noreferrer' }
            : {})}
        >
          About
        </a>

        <div className="cesium-view-panel">
          <label htmlFor="select-raster">Imagery</label>
          <select
            id="select-raster"
            value={rasterName}
            onChange={(e) => setRasterName(e.target.value)}
          >
            {Object.entries(view.rasters).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.displayName}
              </option>
            ))}
          </select>

          {hasTerrains && (
            <>
              <label htmlFor="select-terrain">Terrain</label>
              <select
                id="select-terrain"
                value={terrainName}
                onChange={(e) => changeTerrain(e.target.value)}
              >
                <option value={TERRAIN_NONE}>{TERRAIN_NONE}</option>
                {Object.entries(view.terrains).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.displayName}
                  </option>
                ))}
              </select>
            </>
          )}

          {terrain && (
            <>
              <label htmlFor="select-height-scale">Height Scale</label>
              <select
                id="select-height-scale"
                value={heightScale}
                onChange={(e) => setHeightScale(parseInt(e.target.value, 10))}
              >
                {terrain.heightScales.map((scale) => (
                  <option key={scale} value={scale}>
                    {scale}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {raster?.colorBar && (
        <div className="cesium-view-colorbar">
          <a href={raster.colorBarLink ?? raster.colorBar} target="_blank" rel="noreferrer">
            <img src={raster.colorBar} alt="Color Bar" />
          </a>
        </div>
      )}

      {view.time && (
        <TimeSlider
          cfg={view.time}
          time={time}
          onChange={setTime}
          canAdvance={() => viewerRef.current?.scene.globe.tilesLoaded ?? false}
        />
      )}

      <span ref={coordsRef} className="cesium-view-coordinates" />
    </div>
  );
}

function createImageryProvider(
  rasterName: string,
  raster: RasterCfg,
  time: number | undefined,
) {
  return new GPlatesImageryProvider({
    name: rasterName,
    format: 'png',
    maxLevel: raster.maxLevel,
    creditText: raster.credit ?? CREDIT,
    time,
  }) as unknown as CesiumNS.ImageryProvider;
}

function applyTerrain(
  viewer: CesiumNS.Viewer,
  Cesium: typeof CesiumNS,
  view: ViewCfg,
  terrainName: string,
  heightScale: number,
) {
  if (terrainName === TERRAIN_NONE) {
    viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    return;
  }

  const terrainProvider = new GPlatesTerrainProvider({
    name: terrainName,
    maxLevel: view.terrains[terrainName].maxLevel,
    creditText: CREDIT,
  });
  terrainProvider._terrainDataStructure.heightScale = heightScale;
  viewer.scene.terrainProvider = terrainProvider as unknown as CesiumNS.TerrainProvider;
}
