'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TimeCfg, framesOf } from './viewConfigs';

/** ReconstructionView's fixed frame interval */
const FRAME_INTERVAL_MS = 500;

/** AnimationView's speed list (ms per frame); x8 was selected by default */
const SPEEDS: [number, string][] = [
  [2000, 'x1'],
  [1000, 'x2'],
  [500, 'x4'],
  [250, 'x8'],
  [200, 'x10'],
  [125, 'x16'],
];
const DEFAULT_SPEED = 250;

/**
 * Port of the old static/js/cesium/TimeSlider.js (jQuery UI slider + spinner +
 * transport buttons), minus jQuery.
 *
 * Times are paleo-ages in Ma, so they count *down* towards the present: the
 * first frame is the oldest. "Next" therefore moves towards the present,
 * matching the old setNextTime().
 *
 * Two layouts, as in the old app: reconstruction views get a range slider and a
 * typed Ma box; animation views (the old AnimationView, which hid both) get a
 * frame list and a playback-speed list instead.
 */
export function TimeSlider({
  cfg,
  time,
  onChange,
  canAdvance,
  animation,
}: {
  cfg: TimeCfg;
  time: number;
  onChange: (time: number) => void;
  /** lets the caller hold off the next animation frame while tiles load */
  canAdvance?: () => boolean;
  /** use the animation layout; the fastest speed to offer, in ms per frame */
  animation?: { fastestIntervalMs?: number };
}) {
  const frames = useMemo(() => framesOf(cfg), [cfg]);
  const [playing, setPlaying] = useState(false);
  const [draftTime, setDraftTime] = useState<string | null>(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const interval = animation ? speed : FRAME_INTERVAL_MS;

  const nearestIndex = useCallback(
    (t: number) =>
      frames.reduce((best, f, i) => (Math.abs(f - t) < Math.abs(frames[best] - t) ? i : best), 0),
    [frames],
  );
  const index = nearestIndex(time);

  // the interval callback must see the current frame without being torn down
  // and rebuilt on every frame, which would reset the timer
  const indexRef = useRef(index);
  indexRef.current = index;
  const canAdvanceRef = useRef(canAdvance);
  canAdvanceRef.current = canAdvance;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (canAdvanceRef.current && !canAdvanceRef.current()) return;
      const next = indexRef.current + 1;
      if (next >= frames.length) {
        setPlaying(false);
        return;
      }
      onChange(frames[next]);
    }, interval);
    return () => clearInterval(id);
  }, [playing, frames, interval, onChange]);

  // stop playback when the view (and so the time range) changes underneath us
  useEffect(() => setPlaying(false), [cfg]);

  const goTo = (i: number) => {
    setPlaying(false);
    onChange(frames[Math.max(0, Math.min(frames.length - 1, i))]);
  };

  const commitDraft = (raw: string) => {
    setDraftTime(null);
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) goTo(nearestIndex(parsed));
  };

  return (
    <div className="cesium-view-timeslider">
      <button type="button" title="Jump to oldest" onClick={() => goTo(0)}>
        {'⏮︎'}
      </button>
      <button type="button" title="Step back (older)" onClick={() => goTo(index - 1)}>
        {'⏪︎'}
      </button>
      <button
        type="button"
        className="cesium-view-timeplay"
        title={playing ? 'Pause' : 'Play'}
        onClick={() => {
          // starting from the present would stop at once; replay from the oldest
          if (!playing && index === frames.length - 1) onChange(frames[0]);
          setPlaying((p) => !p);
        }}
      >
        {playing ? '⏸︎' : '▶︎'}
      </button>
      <button type="button" title="Step forward (younger)" onClick={() => goTo(index + 1)}>
        {'⏩︎'}
      </button>
      <button type="button" title="Jump to present" onClick={() => goTo(frames.length - 1)}>
        {'⏭︎'}
      </button>

      {animation ? (
        <>
          <select
            className="cesium-view-timeselect"
            value={frames[index]}
            onChange={(e) => goTo(frames.indexOf(Number(e.target.value)))}
            aria-label="Reconstruction time"
          >
            {frames.map((f) => (
              <option key={f} value={f}>
                {f} Ma
              </option>
            ))}
          </select>
          <select
            className="cesium-view-timeselect"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label="Animation speed"
            title="Animation speed"
          >
            {SPEEDS.filter(([ms]) => ms >= (animation.fastestIntervalMs ?? 0)).map(([ms, label]) => (
              <option key={ms} value={ms}>
                {label}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          {/* oldest on the left, so the slider position is the frame index */}
          <input
            type="range"
            min={0}
            max={frames.length - 1}
            step={1}
            value={index}
            onChange={(e) => goTo(Number(e.target.value))}
            aria-label="Reconstruction time"
          />

          <input
            className="cesium-view-timeinput"
            type="number"
            min={frames[frames.length - 1]}
            max={frames[0]}
            step={cfg.step}
            value={draftTime ?? time}
            onChange={(e) => setDraftTime(e.target.value)}
            onBlur={(e) => commitDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
            aria-label="Reconstruction time in Ma"
          />
          <span className="cesium-view-timeunit">Ma</span>
        </>
      )}
    </div>
  );
}
