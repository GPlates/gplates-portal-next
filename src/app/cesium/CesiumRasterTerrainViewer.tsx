'use client';

import { useEffect, useRef, useState } from 'react';
import type * as CesiumNS from 'cesium';
import { GPlatesImageryProvider } from '../../lib/cesium/GPlatesImageryProvider';
import { GPlatesTerrainProvider } from '../../lib/cesium/GPlatesTerrainProvider';
import { TimeSlider } from './TimeSlider';
import { FeatureInfoPanel } from './FeatureInfoPanel';
import { RidgesPanel } from './RidgesPanel';
import { useFeaturePicking } from './useFeaturePicking';
import { useRasterQuery } from './useRasterQuery';
import { createAnimationFrameProvider } from '../../lib/cesium/animationFrames';
import { createGraticuleProvider, fillGraticuleLabels } from '../../lib/cesium/graticule';
import { DEFAULT_LAYER_COLOR, loadGeoJsonOverlay } from '../../lib/cesium/geoJson';
import {
  CREDIT,
  TERRAIN_NONE,
  RasterCfg,
  ViewCfg,
  ViewName,
  defaultHeightScale,
  defaultRasterName,
  defaultTerrainName,
  getView,
  groupOf,
  OverlayCfg,
  VIEW_GROUPS,
  ViewGroup,
  viewNamesInGroup,
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
  // the viewer is built asynchronously; the effects below key off this so they
  // don't silently no-op on their first run, before it exists
  const [viewerReady, setViewerReady] = useState(false);

  const [viewName, setViewName] = useState<ViewName>(initialView);
  const [group, setGroup] = useState<ViewGroup>(() => groupOf(getView(initialView)));
  // so toggling groups returns to where you were rather than the first entry
  const lastViewPerGroup = useRef<Partial<Record<ViewGroup, ViewName>>>({
    [groupOf(getView(initialView))]: initialView,
  });
  const [rasterName, setRasterName] = useState(() => defaultRasterName(getView(initialView)));
  const [terrainName, setTerrainName] = useState(() => defaultTerrainName(getView(initialView)));
  const [heightScale, setHeightScale] = useState(() =>
    defaultHeightScale(getView(initialView), defaultTerrainName(getView(initialView))),
  );
  // paleo-age in Ma; only meaningful for views that declare a time range
  const [time, setTime] = useState(() => getView(initialView).time?.start ?? 0);
  const [enabledOverlays, setEnabledOverlays] = useState(() =>
    defaultOverlays(getView(initialView)),
  );
  const [showGraticule, setShowGraticule] = useState(() => !!getView(initialView).graticule);

  // the imagery layer currently on screen, plus the ones waiting to be dropped
  // once their replacement has finished loading (see swapImagery)
  const currentLayerRef = useRef<CesiumNS.ImageryLayer | null>(null);
  const staleLayersRef = useRef<CesiumNS.ImageryLayer[]>([]);
  // vector overlays currently on screen, and a token identifying the newest
  // load so slower earlier ones can't overwrite it
  const overlaysRef = useRef<CesiumNS.PrimitiveCollection[]>([]);
  const overlayLoadRef = useRef(0);
  // toggleable imagery overlays, kept above the raster
  const imageryOverlaysRef = useRef<CesiumNS.ImageryLayer[]>([]);
  const graticuleLayerRef = useRef<CesiumNS.ImageryLayer | null>(null);

  // imagery that must stay above the raster/animation frame, in stacking order
  const raiseTopLayers = (viewer: CesiumNS.Viewer) => {
    for (const layer of imageryOverlaysRef.current) viewer.imageryLayers.raiseToTop(layer);
    if (graticuleLayerRef.current) viewer.imageryLayers.raiseToTop(graticuleLayerRef.current);
  };

  const view: ViewCfg = getView(viewName);
  const raster = view.rasters[rasterName];
  const terrain = terrainName === TERRAIN_NONE ? null : view.terrains[terrainName];
  const hasTerrains = Object.keys(view.terrains).length > 0;

  const picking = useFeaturePicking(viewerRef, viewerReady, view.features);
  useRasterQuery(viewerRef, viewerReady, view.rasterQuery, rasterName);
  const colorBar = view.animation ? view.animation.colorBar : raster?.colorBar;
  const colorBarLink = view.animation ? undefined : raster?.colorBarLink;
  const toggleableGeoJson = (view.geoJsonLayers ?? []).filter((l) => l.toggleLabel);

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
        // documented escape hatch for "no base layer"; the imagery effect below
        // owns the raster layer, so the viewer must not add one of its own
        // (without this it falls back to Cesium ion's world imagery)
        imageryProvider: false as unknown as CesiumNS.ImageryProvider,
      });

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
      setViewerReady(true);
    })();

    return () => {
      cancelled = true;
      viewerRef.current = null;
      mouseHandlerRef.current?.destroy();
      mouseHandlerRef.current = null;
      overlaysRef.current = [];
      imageryOverlaysRef.current = [];
      graticuleLayerRef.current = null;
      currentLayerRef.current = null;
      staleLayersRef.current = [];
      setViewerReady(false);
      viewer?.destroy();
    };
    // the viewer is only created once; view/raster/terrain/height-scale changes
    // are applied by the effects below via the live viewerRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // swap the imagery layer whenever the view, raster or reconstruction time changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || (!raster && !view.animation)) return;

    const anim = view.animation;
    const next = viewer.imageryLayers.addImageryProvider(
      anim
        ? createAnimationFrameProvider(anim.name, anim.ext, time, anim.credit)
        : createImageryProvider(rasterName, raster, view.time ? time : undefined),
    );
    if (currentLayerRef.current) {
      staleLayersRef.current.push(currentLayerRef.current);
    }
    currentLayerRef.current = next;
    // a new raster lands on top of the stack, so lift the overlays back over it
    raiseTopLayers(viewer);

    // scrubbing the slider can outrun tile loading; don't let superseded
    // frames pile up while waiting for the globe to settle
    while (staleLayersRef.current.length > 3) {
      viewer.imageryLayers.remove(staleLayersRef.current.shift()!, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerReady, rasterName, raster, view.time, view.animation, time]);

  // swap the terrain provider whenever the view, terrain or height scale changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    import('cesium').then((Cesium) => {
      if (viewerRef.current === viewer) {
        applyTerrain(viewer, Cesium, view, terrainName, heightScale);
      }
    });
  }, [viewerReady, view, terrainName, heightScale]);

  // redraw the imagery overlays whenever the view or the overlay toggles change
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    for (const layer of imageryOverlaysRef.current) {
      viewer.imageryLayers.remove(layer, true);
    }
    imageryOverlaysRef.current = Object.entries(view.overlays ?? {})
      .filter(([name]) => enabledOverlays[name])
      .map(([name, cfg]) => viewer.imageryLayers.addImageryProvider(createOverlayProvider(name, cfg)));
    if (graticuleLayerRef.current) viewer.imageryLayers.raiseToTop(graticuleLayerRef.current);
  }, [viewerReady, view, enabledOverlays]);

  // the graticule: a grid imagery layer on top of everything, plus labels laid
  // out for the globe or the flat map
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || view.graticule === undefined || !showGraticule) return;

    let labels: CesiumNS.LabelCollection | null = null;
    let layer: CesiumNS.ImageryLayer | null = null;
    import('cesium').then((Cesium) => {
      if (viewer.isDestroyed()) return;
      layer = viewer.imageryLayers.addImageryProvider(createGraticuleProvider(Cesium));
      graticuleLayerRef.current = layer;
      labels = viewer.scene.primitives.add(new Cesium.LabelCollection());
      fillGraticuleLabels(Cesium, labels!, projection !== '3D');
    });
    return () => {
      graticuleLayerRef.current = null;
      if (viewer.isDestroyed()) return;
      if (layer) viewer.imageryLayers.remove(layer, true);
      if (labels) viewer.scene.primitives.remove(labels);
    };
  }, [viewerReady, view.graticule, showGraticule, projection]);

  // redraw the vector overlays whenever the view or reconstruction time changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // toggleable layers start off and load only once switched on
    const layers = (view.geoJsonLayers ?? []).filter((l) => !l.toggleLabel || enabledOverlays[l.name]);
    const token = ++overlayLoadRef.current;

    const replaceOverlays = (next: CesiumNS.PrimitiveCollection[]) => {
      // a newer load already landed, so this one is stale
      if (overlayLoadRef.current !== token || viewerRef.current !== viewer) {
        next.forEach((c) => c.destroy());
        return;
      }
      for (const old of overlaysRef.current) {
        viewer.scene.primitives.remove(old);
      }
      overlaysRef.current = next;
      next.forEach((c) => viewer.scene.primitives.add(c));
    };

    if (layers.length === 0) {
      replaceOverlays([]);
      return;
    }

    import('cesium')
      .then((Cesium) =>
        Promise.all(
          layers.map((layer) =>
            loadGeoJsonOverlay(
              Cesium,
              layer.name,
              view.time ? time : 0,
              layer.color ?? DEFAULT_LAYER_COLOR,
            ),
          ),
        ),
      )
      .then(replaceOverlays)
      .catch((err) => console.error('failed to load vector overlay', err));
  }, [viewerReady, view, time, enabledOverlays]);

  // switching view resets the raster/terrain selections to that view's defaults,
  // the way the old app built a whole new RasterTerrainView
  const changeView = (next: ViewName) => {
    const cfg = getView(next);
    const nextTerrain = defaultTerrainName(cfg);
    setViewName(next);
    lastViewPerGroup.current[groupOf(cfg)] = next;
    setRasterName(defaultRasterName(cfg));
    setTerrainName(nextTerrain);
    setHeightScale(defaultHeightScale(cfg, nextTerrain));
    setTime(cfg.time?.start ?? 0);
    setEnabledOverlays(defaultOverlays(cfg));
    setShowGraticule(!!cfg.graticule);
    // keep the URL shareable without remounting the viewer, which a router
    // navigation would do
    window.history.replaceState(null, '', `/cesium/?view=${encodeURIComponent(next)}`);
  };

  const changeGroup = (next: ViewGroup) => {
    setGroup(next);
    changeView(lastViewPerGroup.current[next] ?? viewNamesInGroup(next)[0]);
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

        <div className="cesium-view-picker">
          <div className="cesium-view-switcher">
            <label htmlFor="select-view">View</label>
            <select
              id="select-view"
              value={viewName}
              onChange={(e) => changeView(e.target.value as ViewName)}
            >
              {viewNamesInGroup(group).map((key) => (
                <option key={key} value={key}>
                  {getView(key).title}
                </option>
              ))}
            </select>
          </div>

          <div className="cesium-view-groups">
            {VIEW_GROUPS.map((name) => (
              <label key={name} htmlFor={`group-${name}`}>
                <input
                  type="radio"
                  id={`group-${name}`}
                  name="view-group"
                  value={name}
                  checked={group === name}
                  onChange={() => changeGroup(name)}
                />
                {name}
              </label>
            ))}
          </div>
        </div>

        {view.features?.ridgeFilter && (
          <RidgesPanel
            filter={picking.ridgeFilter}
            onFilterChange={picking.setRidgeFilter}
            ridges={picking.listed}
            selected={picking.selected}
            onPick={picking.flyTo}
          />
        )}
      </div>

      <div className="cesium-view-topleft">
        {view.aboutUrl && (
          <a
            className="cesium-view-about"
            href={view.aboutUrl}
            {...(view.aboutUrl.startsWith('http')
              ? { target: '_blank', rel: 'noreferrer' }
              : {})}
          >
            About
          </a>
        )}

        <div className="cesium-view-panel">
          {raster && (
            <>
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
            </>
          )}

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

          {(view.overlays || toggleableGeoJson.length > 0 || view.graticule !== undefined) && (
            <>
              <span className="cesium-view-panel-label">Overlays</span>
              <div className="cesium-view-overlays">
                {[
                  ...Object.entries(view.overlays ?? {}).map(([name, cfg]) => [name, cfg.displayName]),
                  ...toggleableGeoJson.map((l) => [l.name, l.toggleLabel!]),
                ].map(([name, displayName]) => (
                  <label key={name}>
                    <input
                      type="checkbox"
                      checked={!!enabledOverlays[name]}
                      onChange={(e) =>
                        setEnabledOverlays((prev) => ({ ...prev, [name]: e.target.checked }))
                      }
                    />
                    {displayName}
                  </label>
                ))}
                {view.graticule !== undefined && (
                  <label>
                    <input
                      type="checkbox"
                      checked={showGraticule}
                      onChange={(e) => setShowGraticule(e.target.checked)}
                    />
                    Graticule
                  </label>
                )}
              </div>
            </>
          )}
        </div>

        {view.features && picking.selected && (
          <FeatureInfoPanel
            feature={picking.selected}
            cfg={view.features}
            onClose={() => picking.setSelected(null)}
          />
        )}
      </div>

      {colorBar && (
        <div className="cesium-view-colorbar">
          <a href={colorBarLink ?? colorBar} target="_blank" rel="noreferrer">
            <img src={colorBar} alt="Color Bar" />
          </a>
        </div>
      )}

      {view.time && (
        <TimeSlider
          cfg={view.time}
          time={time}
          onChange={setTime}
          canAdvance={() => viewerRef.current?.scene.globe.tilesLoaded ?? false}
          animation={view.animation}
        />
      )}

      <span ref={coordsRef} className="cesium-view-coordinates" />
      <div ref={picking.tooltipRef} className="cesium-view-tooltip" hidden />
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

function createOverlayProvider(name: string, cfg: OverlayCfg) {
  return new GPlatesImageryProvider({
    name,
    format: 'png',
    maxLevel: cfg.maxLevel,
    // the old overlays passed a blank credit
    creditText: ' ',
  }) as unknown as CesiumNS.ImageryProvider;
}

const defaultOverlays = (view: ViewCfg): Record<string, boolean> => ({
  ...Object.fromEntries(Object.entries(view.overlays ?? {}).map(([name, cfg]) => [name, cfg.enabled])),
  // toggleable vector layers start off, as PaleoDEM's continental blocks did
  ...Object.fromEntries((view.geoJsonLayers ?? []).filter((l) => l.toggleLabel).map((l) => [l.name, false])),
});

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
