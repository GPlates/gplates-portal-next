'use client';

import { scaleLinear } from 'd3';
import type { Profile } from '../../lib/dynamicTopography/service';

/**
 * The dynamic topography profile: one model's value at one point through time.
 *
 * The old portal drew this server-side with matplotlib and sent a PNG; this
 * draws the same plot from the numbers. Same layout: time runs right to left
 * (present day on the right), padded by 10 Ma either side, and the y range
 * hugs the data with 100 m to spare. The point for the time on the globe is
 * drawn red, which the PNG couldn't do.
 */
export function ProfileChart({
  profile,
  currentTime,
  width,
  height,
}: {
  profile: Profile;
  currentTime: number;
  width: number;
  height: number;
}) {
  const compact = width < 500;
  const margin = compact
    ? { top: 34, right: 12, bottom: 36, left: 52 }
    : { top: 44, right: 24, bottom: 52, left: 76 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  const points = profile.times
    .map((t, i) => ({ t, v: profile.values[i] }))
    .filter((p): p is { t: number; v: number } => p.v !== null && Number.isFinite(p.v));

  const tMin = Math.min(...profile.times);
  const tMax = Math.max(...profile.times);
  const x = scaleLinear().domain([tMax + 10, tMin - 10]).range([0, plotW]);

  const vMin = points.length ? Math.min(...points.map((p) => p.v)) : -100;
  const vMax = points.length ? Math.max(...points.map((p) => p.v)) : 100;
  const rate = profile.unit === 'm/Ma';
  // the old 100 m of headroom; for the rate model (tens of m/Ma) that would
  // flatten the line, so scale it down there
  const pad = rate ? 10 : 100;
  const y = scaleLinear().domain([vMin - pad, vMax + pad]).range([plotH, 0]).nice();
  const yLabel = rate ? 'Rate (m/Ma)' : 'Elevation (m)';
  const title = `${rate ? 'Dynamic Topography Change Rate' : 'Dynamic Topography'} at Lon ${profile.lon}, Lat ${profile.lat}`;
  const fontSize = compact ? 10 : 13;

  // break the line where the grid had no value, as matplotlib does at NaN
  const segments: string[] = [];
  let current = '';
  profile.times.forEach((t, i) => {
    const v = profile.values[i];
    if (v === null || !Number.isFinite(v)) {
      if (current) segments.push(current);
      current = '';
      return;
    }
    current += `${current ? 'L' : 'M'}${x(t).toFixed(1)},${y(v).toFixed(1)}`;
  });
  if (current) segments.push(current);

  return (
    <svg
      className="dt-chart"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label={title}
    >
      <text x={width / 2} y={compact ? 14 : 20} textAnchor="middle" fontSize={fontSize + 1} fontWeight={600}>
        {title}
      </text>
      {profile.fake && (
        <text
          x={width / 2}
          y={compact ? 27 : 36}
          textAnchor="middle"
          fontSize={fontSize - 1}
          className="dt-chart-fake"
        >
          Sample data: generated values, not model output
        </text>
      )}

      <g transform={`translate(${margin.left},${margin.top})`}>
        {y.ticks(compact ? 5 : 8).map((v) => (
          <g key={`y${v}`} transform={`translate(0,${y(v)})`}>
            <line x2={plotW} className="dt-chart-grid" />
            <text x={-6} dy="0.32em" textAnchor="end" fontSize={fontSize}>
              {v}
            </text>
          </g>
        ))}
        {x.ticks(compact ? 4 : 8).map((t) => (
          <g key={`x${t}`} transform={`translate(${x(t)},0)`}>
            <line y2={plotH} className="dt-chart-grid" />
            <text y={plotH + fontSize + 4} textAnchor="middle" fontSize={fontSize}>
              {t}
            </text>
          </g>
        ))}
        <rect width={plotW} height={plotH} className="dt-chart-frame" />

        {segments.map((d, i) => (
          <path key={i} d={d} className="dt-chart-line" strokeWidth={compact ? 2 : 3} />
        ))}
        {points.map((p) => {
          const now = p.t === currentTime;
          return (
            <circle
              key={p.t}
              cx={x(p.t)}
              cy={y(p.v)}
              r={now ? (compact ? 4.5 : 6) : compact ? 3 : 4.5}
              className={now ? 'dt-chart-point dt-chart-point-now' : 'dt-chart-point'}
            >
              <title>{`${p.t} Ma: ${p.v} ${profile.unit}`}</title>
            </circle>
          );
        })}

        <text x={plotW / 2} y={plotH + (compact ? 30 : 42)} textAnchor="middle" fontSize={fontSize}>
          Time (Ma)
        </text>
        <text
          transform={`translate(${compact ? -40 : -58},${plotH / 2}) rotate(-90)`}
          textAnchor="middle"
          fontSize={fontSize}
        >
          {yLabel}
        </text>
      </g>
    </svg>
  );
}
