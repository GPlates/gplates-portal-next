'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * One of the rift info panel's line charts -- the d3 v3 `setupChart` inside the
 * old static/js/cesium/RiftObliquityView.js, as plain SVG.
 *
 * Same geometry as the original: the x axis runs right to left, so the present
 * day is on the right and time counts back into the past towards the left; the
 * point at the frame currently on the globe is red and the rest blue; hovering
 * a point gives it the old <svg:title> readout. Wheel zooms both axes about the
 * cursor and dragging pans, as d3.behavior.zoom did.
 *
 * Not ported: the two-second draw-in transition, which interpolated ten extra
 * positions between each pair of points purely to animate the line.
 */

export type RiftChartPoint = {
  x: number;
  y: number;
  /** the hover readout; the old chart put this in an <svg:title> */
  title: string;
};

const MARGIN = { top: 20, right: 20, bottom: 50, left: 80 };

/** the old chart asked for seven ticks along the time axis */
const X_TICKS = 7;

/**
 * One deliberate departure from the original. The old chart left the y axis on
 * d3's default of ten ticks whatever its height, which on the obliquity view's
 * 200px-tall plots crammed thirteen 10px labels into 130px of axis. Deriving
 * the count from the height leaves the 350px plots as they were and thins the
 * short ones out.
 */
const Y_TICK_SPACING = 30;

type Domain = [number, number];

export function RiftChart({
  points,
  xLabel,
  yLabel,
  highlightX,
  width,
  height,
}: {
  points: RiftChartPoint[];
  xLabel: string;
  yLabel: string;
  /** the frame on the globe; its point is drawn red */
  highlightX: number;
  width: number;
  height: number;
}) {
  // useId's value carries colons, which don't belong in a url(#...) reference
  const clipId = `rift-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const plotWidth = width - MARGIN.left - MARGIN.right;
  const plotHeight = height - MARGIN.top - MARGIN.bottom;
  const yTickCount = Math.max(2, Math.round(plotHeight / Y_TICK_SPACING));

  const extents = useMemo(
    () => ({
      x: extent(points.map((p) => p.x)),
      y: extent(points.map((p) => p.y)),
    }),
    [points],
  );

  const [domain, setDomain] = useState(extents);
  // a different point resets the view, the way reopening the old dialog did
  const [prevExtents, setPrevExtents] = useState(extents);
  if (extents !== prevExtents) {
    setPrevExtents(extents);
    setDomain(extents);
  }

  // the old x scale mapped the domain onto [plotWidth, 0] -- oldest on the left
  const xOf = (x: number) => plotWidth - scale(x, domain.x, plotWidth);
  const yOf = (y: number) => plotHeight - scale(y, domain.y, plotHeight);

  const drag = useRef<{ x: number; y: number } | null>(null);

  // React registers wheel handlers passively, so a preventDefault in one is
  // ignored and the info panel would scroll under the chart instead of zooming
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const box = svg.getBoundingClientRect();
      const factor = Math.pow(1.1, e.deltaY > 0 ? 1 : -1);
      // zoom about the cursor, so what is under it stays under it; both axes
      // run from the far edge, so the cursor's share of each domain is mirrored
      const fx = clamp01((e.clientX - box.left - MARGIN.left) / plotWidth);
      const fy = clamp01((e.clientY - box.top - MARGIN.top) / plotHeight);
      setDomain((prev) => ({
        x: zoom(prev.x, 1 - fx, factor),
        y: zoom(prev.y, 1 - fy, factor),
      }));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [plotWidth, plotHeight]);

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setDomain((prev) => ({
      x: pan(prev.x, (dx / plotWidth) * span(prev.x)),
      y: pan(prev.y, (dy / plotHeight) * span(prev.y)),
    }));
  };

  const path = points.map((p, i) => `${i ? 'L' : 'M'}${xOf(p.x)},${yOf(p.y)}`).join('');

  return (
    <svg
      ref={svgRef}
      className="rift-chart"
      width={width}
      height={height}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => {
        drag.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={-10} width={plotWidth + 20} height={plotHeight + 20} />
        </clipPath>
      </defs>

      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        <g className="rift-chart-axis" transform={`translate(0,${plotHeight})`}>
          <line x1={0} y1={0} x2={plotWidth} y2={0} />
          {ticksOf(domain.x, X_TICKS).map((t) => (
            <g key={t} transform={`translate(${xOf(t)},0)`}>
              <line y2={6} />
              <text y={9} dy="0.71em" textAnchor="middle">
                {format(t, domain.x, X_TICKS)}
              </text>
            </g>
          ))}
          <text className="rift-chart-label" x={plotWidth / 2} y={38} textAnchor="middle">
            {xLabel}
          </text>
        </g>

        <g className="rift-chart-axis">
          <line x1={0} y1={0} x2={0} y2={plotHeight} />
          {ticksOf(domain.y, yTickCount).map((t) => (
            <g key={t} transform={`translate(0,${yOf(t)})`}>
              <line x2={-6} />
              <text x={-9} dy="0.32em" textAnchor="end">
                {format(t, domain.y, yTickCount)}
              </text>
            </g>
          ))}
          <text
            className="rift-chart-label"
            transform={`translate(${-MARGIN.left + 14},${plotHeight / 2}) rotate(-90)`}
            textAnchor="middle"
          >
            {yLabel}
          </text>
        </g>

        <g clipPath={`url(#${clipId})`}>
          <path className="rift-chart-line" d={path} />
          {points.map((p) => (
            <circle
              key={`${p.x},${p.y}`}
              className={Math.round(p.x) === highlightX ? 'rift-chart-point-now' : 'rift-chart-point'}
              cx={xOf(p.x)}
              cy={yOf(p.y)}
              r={3.5}
            >
              <title>{p.title}</title>
            </circle>
          ))}
        </g>
      </g>
    </svg>
  );
}

const extent = (values: number[]): Domain =>
  values.length === 0 ? [0, 1] : [Math.min(...values), Math.max(...values)];

const span = ([min, max]: Domain) => (max > min ? max - min : 1);

/** where a value sits along a domain, in pixels from the domain's minimum */
const scale = (value: number, domain: Domain, size: number) =>
  ((value - domain[0]) / span(domain)) * size;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

const zoom = ([min, max]: Domain, focus: number, factor: number): Domain => {
  const at = min + (max - min) * focus;
  return [at - (at - min) * factor, at + (max - at) * factor];
};

/** shifting the domain up moves the data right (x) or down (y), following the drag */
const pan = ([min, max]: Domain, by: number): Domain => [min + by, max + by];

/** d3's tick algorithm: a 1, 2 or 5 times a power of ten that gives ~count ticks */
function ticksOf(domain: Domain, count: number): number[] {
  const step = tickStep(span(domain), count);
  const [min, max] = domain;
  const out: number[] = [];
  // the epsilon keeps a tick that lands exactly on the edge from being lost to
  // floating-point error
  for (let i = Math.ceil(min / step); i * step <= max + step * 1e-9; i++) {
    out.push(round(i * step, step));
  }
  return out;
}

function tickStep(range: number, count: number) {
  const rough = range / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const normalized = rough / magnitude;
  const factor = normalized >= 7.5 ? 10 : normalized >= 3 ? 5 : normalized >= 1.5 ? 2 : 1;
  return factor * magnitude;
}

/** a tick multiple is only as precise as its step, so trim the binary residue */
const round = (value: number, step: number) => {
  const decimals = Math.max(0, Math.ceil(-Math.log10(step)) + 1);
  return Number(value.toFixed(decimals));
};

const format = (value: number, domain: Domain, count: number) => {
  const step = tickStep(span(domain), count);
  const decimals = Math.min(Math.max(0, Math.ceil(-Math.log10(step))), 6);
  return value.toFixed(decimals);
};
