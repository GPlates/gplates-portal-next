'use client';

import { useEffect, useMemo } from 'react';
import { RiftPoint } from '../../lib/cesium/riftPoints';
import { riftTrackCsv, riftTrackCsvName } from '../../lib/cesium/riftTracks';
import { RiftChart, RiftChartPoint } from './RiftChart';
import type { RiftPointsCfg } from './viewConfigs';

/**
 * The charts that open when a rift point is clicked -- the old
 * RiftObliquityView's "#popup-info-panel" jQuery UI dialog.
 *
 * The velocity view plots one tall chart, the obliquity view two short ones
 * (obliquity above velocity), exactly as the old 500x350 / 2 x 500x200 layout
 * did. "Download Data" replaces /portal/get_rift_data/: the same CSV, built in
 * the browser from the track already loaded.
 */

const WIDTH = 500;
const TALL = 350;
const SHORT = 200;

const TIME_LABEL = 'Time Before Present [Ma]';
const VELOCITY_LABEL = 'Full Rift Velocity [mm/yr]';
const OBLIQUITY_LABEL = 'Angle of Obliquity [deg]';

export function RiftInfoPanel({
  point,
  cfg,
  time,
  onClose,
}: {
  point: RiftPoint;
  cfg: RiftPointsCfg;
  /** the frame on the globe, whose point each chart draws red */
  time: number;
  onClose: () => void;
}) {
  const withObliquity = cfg.colorBy === 'obliquity';
  const { track } = point;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const velocity = useMemo(() => chartPoints(track, 'v', 'Velocity'), [track]);
  const obliquity = useMemo(() => chartPoints(track, 'o', 'Obliquity'), [track]);

  const csv = useMemo(() => riftTrackCsv(track, withObliquity), [track, withObliquity]);
  const href = useMemo(
    () => URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    [csv],
  );
  useEffect(() => () => URL.revokeObjectURL(href), [href]);

  return (
    <section className="cesium-view-info rift-info" aria-label="Rift point charts">
      <header>
        <h2>{withObliquity ? 'Rift Obliquity and Velocity' : 'Rift Velocity'}</h2>
        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </header>

      {withObliquity && (
        <RiftChart
          points={obliquity}
          xLabel={TIME_LABEL}
          yLabel={OBLIQUITY_LABEL}
          highlightX={time}
          width={WIDTH}
          height={SHORT}
        />
      )}
      <RiftChart
        points={velocity}
        xLabel={TIME_LABEL}
        yLabel={VELOCITY_LABEL}
        highlightX={time}
        width={WIDTH}
        height={withObliquity ? SHORT : TALL}
      />

      <a className="rift-info-download" href={href} download={riftTrackCsvName(track)}>
        Download Data
      </a>
    </section>
  );
}

/**
 * The old chart's hover readout: the two plotted values, then the point's
 * position, all at the five decimals the source CSVs carry.
 */
function chartPoints(track: RiftPoint['track'], key: 'v' | 'o', name: string): RiftChartPoint[] {
  return track.t.map((t, i) => ({
    x: t,
    y: track[key][i],
    title: [
      `Time : ${t.toFixed(5)}`,
      `${name} : ${track[key][i].toFixed(5)}`,
      `Longitude : ${track.lon[i].toFixed(5)}`,
      `Latitude : ${track.lat[i].toFixed(5)}`,
    ].join('\n'),
  }));
}
