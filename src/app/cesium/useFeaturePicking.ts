'use client';

import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type * as CesiumNS from 'cesium';
import {
  PickableFeature,
  PickableLayer,
  loadPickableLayer,
  pickedFeature,
} from '../../lib/cesium/pickableGeoJson';
import { DEFAULT_RIDGE_FILTER, RidgeFilter, ridgeVisible } from '../../lib/cesium/exRidges';
import type { FeaturesCfg } from './viewConfigs';

/** the old ExRidgesView flew list picks to this camera height */
const FLY_TO_HEIGHT = 7_000_000;

/**
 * Loads a view's clickable GeoJSON layer and wires up the old CesiumView's
 * default mouse handlers: hovering a feature shows its name, clicking one
 * selects it (highlighted on the globe, details in the info panel), and
 * clicking empty globe clears the selection.
 */
export function useFeaturePicking(
  viewerRef: MutableRefObject<CesiumNS.Viewer | null>,
  viewerReady: boolean,
  cfg: FeaturesCfg | undefined,
) {
  const layerRef = useRef<PickableLayer | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [named, setNamed] = useState<PickableFeature[]>([]);
  const [selected, setSelected] = useState<PickableFeature | null>(null);
  const [ridgeFilter, setRidgeFilter] = useState<RidgeFilter>(DEFAULT_RIDGE_FILTER);

  // (re)load the layer whenever the view changes
  useEffect(() => {
    setSelected(null);
    setNamed([]);
    setRidgeFilter(DEFAULT_RIDGE_FILTER);
    const viewer = viewerRef.current;
    if (!viewer || !cfg) return;

    let cancelled = false;
    let layer: PickableLayer | null = null;
    import('cesium')
      .then((Cesium) => loadPickableLayer(Cesium, cfg.layers))
      .then((loaded) => {
        if (cancelled || viewer.isDestroyed()) {
          loaded.destroy();
          return;
        }
        layer = loaded;
        layer.addTo(viewer.scene);
        layerRef.current = layer;
        setNamed(layer.features.filter((f) => f.isNamed));
      })
      .catch((err) => console.error(`failed to load ${cfg.layers.join(', ')} features`, err));

    return () => {
      cancelled = true;
      if (layer && !viewer.isDestroyed()) layer.removeFrom(viewer.scene);
      layerRef.current = null;
    };
  }, [viewerRef, viewerReady, cfg]);

  // only the ExRidges view filters; everything else shows every feature
  const isVisible = useCallback(
    (f: PickableFeature) => !cfg?.ridgeFilter || ridgeVisible(f, ridgeFilter),
    [cfg, ridgeFilter],
  );

  useEffect(() => {
    layerRef.current?.setVisible(isVisible);
    setSelected((current) => (current && !isVisible(current) ? null : current));
  }, [named, isVisible]);

  useEffect(() => {
    layerRef.current?.highlight(selected);
  }, [named, selected]);

  // hover and click
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !cfg) return;

    let handler: CesiumNS.ScreenSpaceEventHandler | null = null;
    let frame = 0;
    let pointer: CesiumNS.Cartesian2 | null = null;
    const canvas = viewer.scene.canvas;

    const hover = () => {
      frame = 0;
      const tooltip = tooltipRef.current;
      if (!tooltip || !pointer || viewer.isDestroyed()) return;
      const feature = pickedFeature(viewer.scene.pick(pointer));
      if (!feature) {
        tooltip.hidden = true;
        canvas.style.cursor = '';
        return;
      }
      tooltip.textContent = feature.name;
      tooltip.style.transform = `translate(${pointer.x + 14}px, ${pointer.y + 14}px)`;
      tooltip.hidden = false;
      canvas.style.cursor = 'pointer';
    };

    import('cesium').then((Cesium) => {
      if (viewer.isDestroyed()) return;
      handler = new Cesium.ScreenSpaceEventHandler(canvas);
      // picking is a render pass of its own, so do it at most once a frame
      handler.setInputAction((m: CesiumNS.ScreenSpaceEventHandler.MotionEvent) => {
        pointer = m.endPosition.clone();
        if (!frame) frame = requestAnimationFrame(hover);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction((m: CesiumNS.ScreenSpaceEventHandler.PositionedEvent) => {
        // drillPick, so a feature under a coastline or another overlay still wins
        const hits = viewer.scene.drillPick(m.position, 8);
        setSelected(hits.map(pickedFeature).find((f) => f !== null) ?? null);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (handler && !handler.isDestroyed()) handler.destroy();
      if (tooltipRef.current) tooltipRef.current.hidden = true;
      canvas.style.cursor = '';
    };
  }, [viewerRef, viewerReady, cfg]);

  const flyTo = useCallback(
    (feature: PickableFeature) => {
      const viewer = viewerRef.current;
      const first = feature.rings[0]?.[0];
      if (viewer && first) {
        import('cesium').then((Cesium) => {
          const carto = Cesium.Cartographic.fromCartesian(first);
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, FLY_TO_HEIGHT),
            duration: 1,
          });
        });
      }
      setSelected(feature);
    },
    [viewerRef],
  );

  const listed = useMemo(() => named.filter(isVisible), [named, isVisible]);

  return { tooltipRef, selected, setSelected, listed, ridgeFilter, setRidgeFilter, flyTo };
}
