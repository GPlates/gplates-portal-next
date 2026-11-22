'use client';

import { useEffect, useRef, useState } from 'react';
import type * as CesiumNS from 'cesium';
import { createGraticuleProvider, fillGraticuleLabels } from '../../lib/cesium/graticule';
import {
  FRAME_LABELS,
  Frame,
  MODELS,
  PROFILE_IS_FAKE,
  Profile,
  fetchProfile,
  profileCsv,
  rasterUrl,
} from '../../lib/dynamicTopography/service';
import { ProfileChart } from './ProfileChart';

/**
 * The dynamic topography viewer: a model's time-dependent dynamic topography
 * images on a Cesium globe, and the value through time at a chosen point.
 *
 * A rewrite of portal/templates/dynamic_topography_cesium.html, whose layout
 * and widgets were Dojo (BorderContainer, HorizontalSlider, ToggleButton,
 * dijit Dialog) around a bare CesiumWidget. Behaviour kept from it:
 *
 * - plate frame, plate frame continent-only (when the model has it) and mantle
 *   frame images; continent-only is the default when present
 * - a time list and a slider over the model's own (irregular) time steps
 * - click the globe, or type lon/lat, to get a profile; mantle frame has none
 * - the profile can be enlarged and downloaded as the same CSV as before
 * - 3D / 2D / Columbus, graticule with labels, lon/lat under the cursor
 *
 * Not ported: holding "a" and clicking dropped yellow dots and joined pairs of
 * them with a line. It was undocumented and the line wasn't used for anything.
 */

const PROJECTIONS = { '3D': '3D Globe', '2D': '2D Map', Columbus: 'Columbus' } as const;
type Projection = keyof typeof PROJECTIONS;

type ProfileState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; profile: Profile }
  | { status: 'error'; message: string };

/** the old viewer opened on this point */
const START = { lon: -90, lat: 35 };

export function DynamicTopographyViewer({ modelId, name }: { modelId: string; name: string }) {
  const model = MODELS[modelId];
  const times = model.times;

  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumNS.Viewer | null>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const pinsRef = useRef<CesiumNS.BillboardCollection | null>(null);
  const currentLayerRef = useRef<CesiumNS.ImageryLayer | null>(null);
  const staleLayersRef = useRef<CesiumNS.ImageryLayer[]>([]);
  const graticuleLayerRef = useRef<CesiumNS.ImageryLayer | null>(null);

  const [viewerReady, setViewerReady] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [frame, setFrame] = useState<Frame>(model.continentOnly ? 'plate_co' : 'plate');
  const [timeIndex, setTimeIndex] = useState(0);
  const [projection, setProjection] = useState<Projection>('3D');
  const [showGraticule, setShowGraticule] = useState(false);

  // the typed coordinates, and the point the profile is for
  const [lonInput, setLonInput] = useState(String(START.lon));
  const [latInput, setLatInput] = useState(String(START.lat));
  const [inputError, setInputError] = useState<string | null>(null);
  const [point, setPoint] = useState(START);
  const [profile, setProfile] = useState<ProfileState>({ status: 'idle' });
  const [enlarged, setEnlarged] = useState<'profile' | 'legend' | null>(null);

  // the click handler is registered once, so it reads the frame through a ref
  const frameRef = useRef(frame);
  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  const time = times[timeIndex];
  const profileFrame = frame === 'mantle' ? null : frame;

  // create the globe once
  useEffect(() => {
    let cancelled = false;
    let viewer: CesiumNS.Viewer | undefined;
    let handler: CesiumNS.ScreenSpaceEventHandler | undefined;

    (async () => {
      const Cesium = await import('cesium');
      if (cancelled || !containerRef.current) return;
      window.CESIUM_BASE_URL = '/cesium/';

      try {
        viewer = new Cesium.Viewer(containerRef.current, {
          baseLayerPicker: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          infoBox: false,
          selectionIndicator: false,
          imageryProvider: false as unknown as CesiumNS.ImageryProvider,
        });
      } catch (err) {
        console.error(err);
        setViewerError('Your browser could not start the 3D globe (WebGL).');
        return;
      }

      const scene = viewer.scene;
      scene.skyBox = undefined as unknown as CesiumNS.SkyBox;
      scene.skyAtmosphere = undefined as unknown as CesiumNS.SkyAtmosphere;
      scene.sun = undefined as unknown as CesiumNS.Sun;
      scene.moon = undefined as unknown as CesiumNS.Moon;
      scene.fog.enabled = false;
      scene.globe.showGroundAtmosphere = false;
      scene.globe.baseColor = Cesium.Color.DARKGREY;
      scene.camera.setView({ destination: Cesium.Cartesian3.fromDegrees(START.lon, START.lat, 20000000) });

      // drop superseded images once the new one is on screen, so stepping
      // through time doesn't flash the bare globe
      scene.globe.tileLoadProgressEvent.addEventListener((queued: number) => {
        if (queued > 0 || staleLayersRef.current.length === 0) return;
        for (const layer of staleLayersRef.current.splice(0)) viewer!.imageryLayers.remove(layer, true);
      });

      pinsRef.current = scene.primitives.add(new Cesium.BillboardCollection());

      handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      const pick = (position: CesiumNS.Cartesian2) => {
        const cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid);
        if (!cartesian) return null;
        const carto = scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        return {
          lon: Number(Cesium.Math.toDegrees(carto.longitude).toFixed(2)),
          lat: Number(Cesium.Math.toDegrees(carto.latitude).toFixed(2)),
        };
      };
      // written straight to the DOM: this fires on every mouse move
      handler.setInputAction((movement: CesiumNS.ScreenSpaceEventHandler.MotionEvent) => {
        if (!coordsRef.current) return;
        const p = pick(movement.endPosition);
        coordsRef.current.textContent = p ? `Lon ${p.lon.toFixed(2)}, Lat ${p.lat.toFixed(2)}` : '';
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction((click: CesiumNS.ScreenSpaceEventHandler.PositionedEvent) => {
        // the mantle frame has no profile, as before
        if (frameRef.current === 'mantle') return;
        const p = pick(click.position);
        if (!p) return;
        setLonInput(String(p.lon));
        setLatInput(String(p.lat));
        setInputError(null);
        setPoint(p);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      viewerRef.current = viewer;
      setViewerReady(true);
    })();

    return () => {
      cancelled = true;
      handler?.destroy();
      viewerRef.current = null;
      pinsRef.current = null;
      currentLayerRef.current = null;
      staleLayersRef.current = [];
      graticuleLayerRef.current = null;
      setViewerReady(false);
      viewer?.destroy();
    };
  }, []);

  // the image for the current model, frame and time
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    let cancelled = false;
    import('cesium').then((Cesium) => {
      if (cancelled || viewer.isDestroyed()) return;
      const next = viewer.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({ url: rasterUrl(modelId, time, frame) }),
      );
      if (currentLayerRef.current) staleLayersRef.current.push(currentLayerRef.current);
      currentLayerRef.current = next;
      if (graticuleLayerRef.current) viewer.imageryLayers.raiseToTop(graticuleLayerRef.current);
      // dragging the slider can outrun loading; don't let old images pile up
      while (staleLayersRef.current.length > 3) {
        viewer.imageryLayers.remove(staleLayersRef.current.shift()!, true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [viewerReady, modelId, time, frame]);

  // the pin at the profile point; none in the mantle frame
  useEffect(() => {
    const pins = pinsRef.current;
    if (!pins) return;
    let cancelled = false;
    import('cesium').then((Cesium) => {
      if (cancelled || pins.isDestroyed()) return;
      pins.removeAll();
      if (!profileFrame) return;
      pins.add({
        image: new Cesium.PinBuilder().fromText('O', Cesium.Color.GREENYELLOW, 32),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [viewerReady, point, profileFrame]);

  // the profile for the point
  useEffect(() => {
    if (!profileFrame) return;
    const controller = new AbortController();
    setProfile({ status: 'loading' });
    fetchProfile(modelId, point.lon, point.lat, profileFrame, controller.signal)
      .then((p) => setProfile({ status: 'ready', profile: p }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error(err);
        setProfile({ status: 'error', message: 'Could not get the profile for this point.' });
      });
    return () => controller.abort();
  }, [modelId, point, profileFrame]);

  // graticule grid and labels
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !showGraticule) return;
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
  }, [viewerReady, showGraticule, projection]);

  // Escape closes the enlarged profile or legend
  useEffect(() => {
    if (!enlarged) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setEnlarged(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enlarged]);

  const changeProjection = (next: Projection) => {
    setProjection(next);
    const scene = viewerRef.current?.scene;
    if (!scene) return;
    if (next === '2D') scene.morphTo2D(0.1);
    else if (next === 'Columbus') scene.morphToColumbusView(0.1);
    else scene.morphTo3D(0.1);
  };

  const showTypedPoint = () => {
    const lon = Number(lonInput);
    const lat = Number(latInput);
    if (lonInput.trim() === '' || !Number.isFinite(lon) || lon < -180 || lon > 180) {
      setInputError('Longitude must be between -180 and 180.');
      return;
    }
    if (latInput.trim() === '' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
      setInputError('Latitude must be between -90 and 90.');
      return;
    }
    setInputError(null);
    setPoint({ lon, lat });
  };

  const downloadCsv = (p: Profile) => {
    const url = URL.createObjectURL(new Blob([profileCsv(p)], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dynamic_topography_profile.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const frames: Frame[] = model.continentOnly ? ['plate_co', 'plate', 'mantle'] : ['plate', 'mantle'];
  const ready = profile.status === 'ready' ? profile.profile : null;

  return (
    <div className="dt-page">
      <aside className="dt-sidebar">
        <a className="dt-back" href="/portal/dt/">
          ← All models
        </a>
        <h1 className="dt-title">{name}</h1>

        <fieldset className="dt-frames">
          <legend>Reference frame</legend>
          {frames.map((f) => (
            <label key={f}>
              <input type="radio" name="frame" checked={frame === f} onChange={() => setFrame(f)} />
              {FRAME_LABELS[f]}
            </label>
          ))}
        </fieldset>

        {profileFrame ? (
          <section className="dt-profile" aria-live="polite">
            <h2>Profile through time</h2>
            <p className="dt-hint">Click the globe, or enter a point.</p>
            <form
              className="dt-point"
              onSubmit={(e) => {
                e.preventDefault();
                showTypedPoint();
              }}
            >
              <label>
                Longitude
                <input type="number" step="any" value={lonInput} onChange={(e) => setLonInput(e.target.value)} />
              </label>
              <label>
                Latitude
                <input type="number" step="any" value={latInput} onChange={(e) => setLatInput(e.target.value)} />
              </label>
              <button type="submit" disabled={profile.status === 'loading'}>
                Show Profile
              </button>
            </form>
            {inputError && <p className="dt-error">{inputError}</p>}

            {profile.status === 'loading' && <p className="dt-status">Generating profile chart…</p>}
            {profile.status === 'error' && <p className="dt-error">{profile.message}</p>}
            {ready && (
              <>
                <button
                  type="button"
                  className="dt-chart-button"
                  onClick={() => setEnlarged('profile')}
                  aria-label="Enlarge the profile chart"
                >
                  <ProfileChart profile={ready} currentTime={Number(time)} width={300} height={220} />
                </button>
                <p className="dt-hint">Click the chart to enlarge it.</p>
                <button type="button" className="dt-button" onClick={() => downloadCsv(ready)}>
                  Download Profile Data
                </button>
              </>
            )}
          </section>
        ) : (
          <p className="dt-hint">Profiles are only available in the plate reference frame.</p>
        )}

        {model.downloads && (
          <p className="dt-downloads">
            <a
              href={`https://www.earthbyte.org/webdav/ftp/Dynamic_Topography/${modelId}/`}
              target="_blank"
              rel="noreferrer"
            >
              Download Grids
            </a>
            <a
              href={`https://www.earthbyte.org/webdav/ftp/Dynamic_Topography/${modelId}/Reconstruction/`}
              target="_blank"
              rel="noreferrer"
            >
              Download Reconstruction Files
            </a>
          </p>
        )}

        <button
          type="button"
          className="dt-legend"
          onClick={() => setEnlarged('legend')}
          aria-label="Enlarge the legend"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={model.legend} alt="Legend" />
          <span className="dt-hint">Click to enlarge the legend.</span>
        </button>
      </aside>

      <div className="dt-globe">
        <div ref={containerRef} className="dt-cesium" />
        {viewerError && (
          <div className="dt-globe-error">
            <p>{viewerError}</p>
            <a href="/portal/webgl_support_info">How to enable WebGL</a>
          </div>
        )}

        <div className="dt-time">
          <label>
            <span className="dt-visually-hidden">Time</span>
            <select value={timeIndex} onChange={(e) => setTimeIndex(Number(e.target.value))}>
              {times.map((t, i) => (
                <option key={t} value={i}>
                  {t} Ma
                </option>
              ))}
            </select>
          </label>
          <input
            type="range"
            min={0}
            max={times.length - 1}
            step={1}
            value={timeIndex}
            onChange={(e) => setTimeIndex(Number(e.target.value))}
            aria-label="Time"
            aria-valuetext={`${time} Ma`}
          />
        </div>

        <div className="dt-topright">
          <div className="cesium-view-projections">
            {Object.entries(PROJECTIONS).map(([key, label]) => (
              <label key={key}>
                <input
                  type="radio"
                  name="projection"
                  checked={projection === key}
                  onChange={() => changeProjection(key as Projection)}
                />
                {label}
              </label>
            ))}
          </div>
          <label className="dt-graticule">
            <input type="checkbox" checked={showGraticule} onChange={(e) => setShowGraticule(e.target.checked)} />
            Graticule
          </label>
        </div>

        {PROFILE_IS_FAKE && profileFrame && (
          <p className="dt-fake-banner">Profiles show sample data until the GPlates Web Service endpoint is ready.</p>
        )}
        <span ref={coordsRef} className="dt-coords" />
      </div>

      {enlarged && (
        <div className="dt-modal" role="dialog" aria-modal="true" onClick={() => setEnlarged(null)}>
          <div className="dt-modal-body" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="dt-modal-close" onClick={() => setEnlarged(null)} aria-label="Close">
              ×
            </button>
            {enlarged === 'profile' && ready ? (
              <ProfileChart profile={ready} currentTime={Number(time)} width={900} height={600} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={model.legend} alt="Legend" className="dt-modal-legend" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
