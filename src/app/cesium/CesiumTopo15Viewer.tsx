'use client';

import { useEffect, useRef, useState } from 'react';
import type * as CesiumNS from 'cesium';
import { GPlatesImageryProvider } from '../../lib/cesium/GPlatesImageryProvider';
import { GPlatesTerrainProvider } from '../../lib/cesium/GPlatesTerrainProvider';

const CREDIT = 'EarthByte Group and Scripps Institution of Oceanography';

const RASTERS = {
  topo15: {
    displayName: 'SRTM15_PLUS V1 ETOPO1',
    maxLevel: 8,
    colorBar: '/img/haxby-height-color-bar.png',
  },
  topo15_haxby: {
    displayName: 'SRTM15_PLUS V1 Haxby',
    maxLevel: 8,
    colorBar: null,
  },
} as const;

const TERRAINS = {
  topo15: {
    displayName: 'SRTM15_PLUS V1',
    maxLevel: 8,
    heightScales: [1, 5, 10, 20, 30, 40, 50, 100],
  },
} as const;

type RasterName = keyof typeof RASTERS;
type TerrainName = keyof typeof TERRAINS | 'None';

const DEFAULT_HEIGHT_SCALE = 30;

export function CesiumTopo15Viewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumNS.Viewer | null>(null);

  const [rasterName, setRasterName] = useState<RasterName>('topo15');
  const [terrainName, setTerrainName] = useState<TerrainName>('topo15');
  const [heightScale, setHeightScale] = useState(DEFAULT_HEIGHT_SCALE);

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
        imageryProvider: new GPlatesImageryProvider({
          name: rasterName,
          format: 'png',
          maxLevel: RASTERS[rasterName].maxLevel,
          creditText: CREDIT,
        }) as unknown as CesiumNS.ImageryProvider,
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

      applyTerrain(viewer, Cesium, terrainName, heightScale);

      viewerRef.current = viewer;
    })();

    return () => {
      cancelled = true;
      viewerRef.current = null;
      viewer?.destroy();
    };
    // the viewer is only created once; raster/terrain/height-scale changes
    // are applied by the effects below via the live viewerRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // swap the imagery layer whenever the raster selection changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(
      new GPlatesImageryProvider({
        name: rasterName,
        format: 'png',
        maxLevel: RASTERS[rasterName].maxLevel,
        creditText: CREDIT,
      }) as unknown as CesiumNS.ImageryProvider,
    );
  }, [rasterName]);

  // swap the terrain provider whenever the terrain selection or height scale changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    import('cesium').then((Cesium) => {
      if (viewerRef.current === viewer) {
        applyTerrain(viewer, Cesium, terrainName, heightScale);
      }
    });
  }, [terrainName, heightScale]);

  const colorBar = RASTERS[rasterName].colorBar;
  const heightScaleOptions = terrainName !== 'None' ? TERRAINS[terrainName].heightScales : [];

  return (
    <div className="cesium-topo15-page">
      <div ref={containerRef} className="cesium-topo15-container" />

      <div className="cesium-topo15-panel">
        <label htmlFor="select-raster">Imagery</label>
        <select
          id="select-raster"
          value={rasterName}
          onChange={(e) => setRasterName(e.target.value as RasterName)}
        >
          {Object.entries(RASTERS).map(([key, raster]) => (
            <option key={key} value={key}>
              {raster.displayName}
            </option>
          ))}
        </select>

        <label htmlFor="select-terrain">Terrain</label>
        <select
          id="select-terrain"
          value={terrainName}
          onChange={(e) => setTerrainName(e.target.value as TerrainName)}
        >
          <option value="None">None</option>
          {Object.entries(TERRAINS).map(([key, terrain]) => (
            <option key={key} value={key}>
              {terrain.displayName}
            </option>
          ))}
        </select>

        {terrainName !== 'None' && (
          <>
            <label htmlFor="select-height-scale">Height Scale</label>
            <select
              id="select-height-scale"
              value={heightScale}
              onChange={(e) => setHeightScale(parseInt(e.target.value, 10))}
            >
              {heightScaleOptions.map((scale) => (
                <option key={scale} value={scale}>
                  {scale}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {colorBar && (
        <div className="cesium-topo15-colorbar">
          <a href={colorBar} target="_blank" rel="noreferrer">
            <img src={colorBar} alt="Color Bar" />
          </a>
        </div>
      )}

      <a className="cesium-topo15-home" href="/portal/srtm15">
        Home
      </a>
    </div>
  );
}

function applyTerrain(
  viewer: CesiumNS.Viewer,
  Cesium: typeof CesiumNS,
  terrainName: TerrainName,
  heightScale: number,
) {
  if (terrainName === 'None') {
    viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    return;
  }

  const terrainProvider = new GPlatesTerrainProvider({
    name: terrainName,
    maxLevel: TERRAINS[terrainName].maxLevel,
    creditText: CREDIT,
  });
  terrainProvider._terrainDataStructure.heightScale = heightScale;
  viewer.scene.terrainProvider = terrainProvider as unknown as CesiumNS.TerrainProvider;
}
