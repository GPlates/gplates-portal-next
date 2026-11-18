/**
 * The two colour maps the old portal's rift endpoints baked into their GeoJSON.
 *
 * portal/rift_obliquity.py built them with matplotlib --
 * `LinearSegmentedColormap.from_list(...)` over a `Normalize(vmin=0, vmax=...)`
 * -- and wrote the resulting rgba into every point's `color` property, which is
 * why there were two endpoints over identical geometry: get_rift_points
 * coloured by obliquity (0..90 deg) and get_rift_points_v by velocity
 * (0..50 mm/yr).
 *
 * Reproduced here instead so one static dataset serves all three rift views.
 * It is matplotlib's behaviour, not an approximation of it:
 *   - from_list interpolates its stops linearly into a 256-entry table, sampled
 *     at i/255 (matplotlib's _create_lookup_table with the default gamma);
 *   - Colormap.__call__ then indexes that table with floor(x * 256), clamped,
 *     so the output is quantized to those 256 steps rather than continuous.
 * Checked against 66,342 obliquity and 1,075 velocity points straight from the
 * old endpoints: identical to within floating-point epsilon.
 */

export type Rgb = [number, number, number];

type Stop = [position: number, color: Rgb];

const LUT_SIZE = 256;

/** the 'obliquity' map: blue - grey - green - yellow - red */
const OBLIQUITY_STOPS: Stop[] = [
  [0, [0.2392, 0.3216, 0.6196]],
  [0.25, [0.85, 0.85, 0.85]],
  [0.5, [0.5216, 0.7529, 0.3765]],
  [0.75, [0.9608, 0.9059, 0.3137]],
  [1, [0.898, 0.1412, 0.1804]],
];

/** the 'velocity' map: purple - blue - cyan - green - yellow - orange - red */
const VELOCITY_STOPS: Stop[] = [
  [0, [0.4902, 0.2431, 0.5529]],
  [0.1, [0, 0.098, 0.6]],
  [0.2, [0.0039, 0.5647, 0.8588]],
  [0.3, [0.0745, 0.6667, 0.6431]],
  [0.4, [0.3922, 0.6314, 0.3647]],
  [0.5, [0.6196, 0.9373, 0.5961]],
  [0.6, [0.9294, 0.9255, 0.3804]],
  [0.7, [1.0, 0.7686, 0.149]],
  [0.8, [0.9922, 0.3569, 0.3529]],
  [0.9, [0.7333, 0, 0.0431]],
  [1.0, [0.7, 0, 0]],
];

function buildLut(stops: Stop[]): Rgb[] {
  const lut: Rgb[] = [];
  for (let i = 0; i < LUT_SIZE; i++) {
    const x = i / (LUT_SIZE - 1);
    // the first stop whose position x has reached; stops are sorted and span 0..1
    const upper = stops.findIndex(([position]) => x <= position);
    if (upper <= 0) {
      lut.push([...stops[Math.max(upper, 0)][1]]);
      continue;
    }
    const [x0, c0] = stops[upper - 1];
    const [x1, c1] = stops[upper];
    const f = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
    lut.push([0, 1, 2].map((k) => c0[k] + (c1[k] - c0[k]) * f) as Rgb);
  }
  return lut;
}

/** what each map is normalized over, as the old Normalize(vmin=0, vmax=N) did */
export const RIFT_COLOR_RANGE = { obliquity: 90, velocity: 50 } as const;

export type RiftColorBy = keyof typeof RIFT_COLOR_RANGE;

const LUTS: Record<RiftColorBy, Rgb[]> = {
  obliquity: buildLut(OBLIQUITY_STOPS),
  velocity: buildLut(VELOCITY_STOPS),
};

/** the colour the old endpoint would have given this obliquity or velocity */
export function riftColor(colorBy: RiftColorBy, value: number): Rgb {
  const lut = LUTS[colorBy];
  const x = value / RIFT_COLOR_RANGE[colorBy];
  // Colormap.__call__: floor(x * N), with anything at or past the top edge
  // landing on the last entry and anything below 0 on the first
  const index = Math.min(Math.max(Math.floor(x * LUT_SIZE), 0), LUT_SIZE - 1);
  return lut[Number.isFinite(index) ? index : 0];
}

/**
 * Marker size, from `scale = 0.5 + 0.04 * velocity` in both old endpoints -- so
 * a circle's size always reads as rift velocity, even on the obliquity view
 * where its colour does not.
 */
export const riftScale = (velocity: number) => 0.5 + 0.04 * velocity;
