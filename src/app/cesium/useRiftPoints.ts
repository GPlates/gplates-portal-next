'use client';

import { MutableRefObject, useEffect, useRef, useState } from 'react';
import type * as CesiumNS from 'cesium';
import {
  RiftPoint,
  RiftPointsLayer,
  createRiftPointsLayer,
  pickedRiftPoint,
} from '../../lib/cesium/riftPoints';
import { loadRiftTracks } from '../../lib/cesium/riftTracks';
import type { RiftPointsCfg } from './viewConfigs';

/**
 * The rift views' own mouse handling, from the old RiftObliquityView.init():
 * hovering a point enlarges it, clicking one pins it and opens its charts, and
 * clicking empty globe closes them again. Stepping the time slider clears both,
 * as the old setTime() did.
 *
 * Unlike useFeaturePicking there is no hover tooltip -- the old view replaced
 * CesiumView's default handlers rather than extending them, and these points
 * carry no name to show.
 */
export function useRiftPoints(
  viewerRef: MutableRefObject<CesiumNS.Viewer | null>,
  viewerReady: boolean,
  cfg: RiftPointsCfg | undefined,
  time: number,
) {
  const layerRef = useRef<RiftPointsLayer | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<RiftPoint | null>(null);

  // a new view starts unloaded with nothing selected, and a new frame drops
  // the selection with the frame it belonged to. Reset while rendering rather
  // than in an effect, so there's no stale frame.
  const [prev, setPrev] = useState({ cfg, time });
  if (cfg !== prev.cfg || time !== prev.time) {
    setPrev({ cfg, time });
    setSelected(null);
    if (cfg !== prev.cfg) {
      setReady(false);
      setError(null);
    }
  }

  // load the dataset and build the layer whenever the view changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !cfg) return;

    let cancelled = false;
    let layer: RiftPointsLayer | null = null;
    Promise.all([import('cesium'), loadRiftTracks()])
      .then(([Cesium, dataset]) => {
        if (cancelled || viewer.isDestroyed()) return;
        layer = createRiftPointsLayer(Cesium, dataset, cfg.colorBy);
        layer.addTo(viewer.scene);
        layerRef.current = layer;
        setReady(true);
      })
      .catch((err) => {
        console.error('failed to load the rift points', err);
        if (!cancelled) setError('Rift point data is unavailable.');
      });

    return () => {
      cancelled = true;
      if (layer && !viewer.isDestroyed()) layer.removeFrom(viewer.scene);
      else layer?.destroy();
      layerRef.current = null;
    };
  }, [viewerRef, viewerReady, cfg]);

  // show the frame's points
  useEffect(() => {
    layerRef.current?.setFrame(time);
  }, [ready, time]);

  useEffect(() => {
    layerRef.current?.pin(selected);
  }, [ready, selected]);

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
      if (!pointer || viewer.isDestroyed()) return;
      const point = pickedRiftPoint(viewer.scene.pick(pointer));
      layerRef.current?.highlight(point);
      canvas.style.cursor = point ? 'pointer' : '';
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
        // drillPick, so a point under the graticule or another marker still wins
        const hits = viewer.scene.drillPick(m.position, 8);
        setSelected(hits.map(pickedRiftPoint).find((p) => p !== null) ?? null);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (handler && !handler.isDestroyed()) handler.destroy();
      layerRef.current?.highlight(null);
      canvas.style.cursor = '';
    };
  }, [viewerRef, viewerReady, cfg]);

  return { selected, setSelected, error };
}
