'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TimeCfg } from './viewConfigs';

const FRAME_INTERVAL_MS = 500;

/**
 * Port of the old static/js/cesium/TimeSlider.js (jQuery UI slider + spinner +
 * transport buttons), minus jQuery.
 *
 * Times are paleo-ages in Ma, so they count *down* towards the present:
 * `cfg.start` is the oldest frame and `cfg.end` the youngest. "Next" therefore
 * moves towards the present, matching the old setNextTime().
 */
export function TimeSlider({
  cfg,
  time,
  onChange,
  canAdvance,
}: {
  cfg: TimeCfg;
  time: number;
  onChange: (time: number) => void;
  /** lets the caller hold off the next animation frame while tiles load */
  canAdvance?: () => boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [draftTime, setDraftTime] = useState<string | null>(null);

  const clamp = useCallback(
    (t: number) => Math.min(cfg.start, Math.max(cfg.end, t)),
    [cfg.start, cfg.end],
  );

  // the interval callback must see the current time without being torn down
  // and rebuilt on every frame, which would reset the timer
  const timeRef = useRef(time);
  timeRef.current = time;
  const canAdvanceRef = useRef(canAdvance);
  canAdvanceRef.current = canAdvance;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (canAdvanceRef.current && !canAdvanceRef.current()) return;
      const next = timeRef.current - cfg.step;
      if (next < cfg.end) {
        setPlaying(false);
        return;
      }
      onChange(next);
    }, FRAME_INTERVAL_MS);
    return () => clearInterval(id);
  }, [playing, cfg.step, cfg.end, onChange]);

  // stop playback when the view (and so the time range) changes underneath us
  useEffect(() => setPlaying(false), [cfg]);

  const step = (delta: number) => {
    setPlaying(false);
    onChange(clamp(time + delta));
  };

  const commitDraft = (raw: string) => {
    setDraftTime(null);
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) onChange(clamp(parsed));
  };

  return (
    <div className="cesium-view-timeslider">
      <button type="button" title="Oldest" onClick={() => step(cfg.start - time)}>
        ⏮
      </button>
      <button type="button" title="Previous (older)" onClick={() => step(cfg.step)}>
        ◀
      </button>
      <button
        type="button"
        title={playing ? 'Pause' : 'Play'}
        onClick={() => setPlaying((p) => !p)}
      >
        {playing ? '⏸' : '▶'}
      </button>
      <button type="button" title="Next (younger)" onClick={() => step(-cfg.step)}>
        ▶
      </button>
      <button type="button" title="Present" onClick={() => step(cfg.end - time)}>
        ⏭
      </button>

      {/* the range runs oldest-on-the-left, so its value is the distance
          travelled from cfg.start rather than the age itself */}
      <input
        type="range"
        min={0}
        max={cfg.start - cfg.end}
        step={cfg.step}
        value={cfg.start - time}
        onChange={(e) => {
          setPlaying(false);
          onChange(clamp(cfg.start - Number(e.target.value)));
        }}
        aria-label="Reconstruction time"
      />

      <input
        className="cesium-view-timeinput"
        type="number"
        min={cfg.end}
        max={cfg.start}
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
    </div>
  );
}
