'use client';

import { MutableRefObject, useEffect } from 'react';
import type * as CesiumNS from 'cesium';
import { circleImage } from '../../lib/cesium/pointImages';
import { queryRaster } from '../../lib/cesium/gws';
import type { ViewCfg } from './viewConfigs';

/**
 * Port of the old CesiumView.addRasterQueryLeftClickHandler: clicking the globe
 * drops a yellow marker and asks GWS for the raster's value there, shown in a
 * label beside the marker.
 *
 * The old AgeGridP view always queried age_grid_geek_2007 whichever raster was
 * on screen; this queries the selected one (GWS has both age grids).
 */
export function useRasterQuery(
  viewerRef: MutableRefObject<CesiumNS.Viewer | null>,
  viewerReady: boolean,
  cfg: ViewCfg['rasterQuery'],
  rasterName: string,
) {
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !cfg) return;

    let handler: CesiumNS.ScreenSpaceEventHandler | null = null;
    let markers: CesiumNS.BillboardCollection | null = null;
    let labels: CesiumNS.LabelCollection | null = null;
    let request = 0;

    import('cesium').then((Cesium) => {
      if (viewer.isDestroyed()) return;
      const scene = viewer.scene;
      markers = scene.primitives.add(new Cesium.BillboardCollection());
      labels = scene.primitives.add(new Cesium.LabelCollection());
      const label = labels!.add({
        show: false,
        font: '16px monospace',
        showBackground: true,
        pixelOffset: new Cesium.Cartesian2(12, 0),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      });

      handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction((m: CesiumNS.ScreenSpaceEventHandler.PositionedEvent) => {
        const position = scene.camera.pickEllipsoid(m.position, scene.globe.ellipsoid);
        markers!.removeAll();
        label.show = false;
        if (!position) return;

        markers!.add({ image: circleImage(), position, color: Cesium.Color.YELLOW, scale: 0.7 });
        const carto = Cesium.Cartographic.fromCartesian(position);
        const lon = Cesium.Math.toDegrees(carto.longitude);
        const lat = Cesium.Math.toDegrees(carto.latitude);
        const token = ++request;

        queryRaster(rasterName, lon, lat)
          .then((raw) => {
            if (token !== request || viewer.isDestroyed()) return;
            // GWS answers "null"/"nan" off the raster's data (e.g. on land for an
            // age grid), which the old label showed verbatim
            const value = !Number.isFinite(parseFloat(raw))
              ? 'no data'
              : cfg.integerRasters?.includes(rasterName)
                ? String(parseInt(raw, 10))
                : raw;
            label.text = `Value: ${value}\nLon: ${lon.toFixed(2)}, Lat: ${lat.toFixed(2)}`;
            label.position = position;
            label.show = true;
          })
          .catch((err) => console.warn('raster query failed', err));
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });

    return () => {
      request++;
      if (handler && !handler.isDestroyed()) handler.destroy();
      if (!viewer.isDestroyed()) {
        if (markers) viewer.scene.primitives.remove(markers);
        if (labels) viewer.scene.primitives.remove(labels);
      }
    };
  }, [viewerRef, viewerReady, cfg, rasterName]);
}
