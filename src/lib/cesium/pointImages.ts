/**
 * The two point markers from the old static/js/cesium/Utils.js: a 16px white
 * circle, and a triangle for features with `shape: "t"`. White so that
 * Billboard.color tints them to the feature's colour.
 */
let circle: HTMLCanvasElement | null = null;
let triangle: HTMLCanvasElement | null = null;

function canvas(draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.beginPath();
  draw(ctx);
  ctx.closePath();
  ctx.fill();
  return c;
}

export function circleImage() {
  return (circle ??= canvas((ctx) => ctx.arc(8, 8, 8, 0, Math.PI * 2, true)));
}

export function pointImage(shape: unknown) {
  if (shape !== 't') return circleImage();
  return (triangle ??= canvas((ctx) => {
    ctx.moveTo(8, 0);
    ctx.lineTo(0, 16);
    ctx.lineTo(16, 16);
  }));
}

/**
 * Whether a GeoJSON position is usable. Some source data has text where
 * numbers belong (one deep-biosphere site gives "26.796 to 29.144"), which the
 * old app silently drew nowhere.
 */
export const isLonLat = (c: unknown): c is number[] =>
  Array.isArray(c) && c.length >= 2 && c.slice(0, 2).every((v) => typeof v === 'number' && Number.isFinite(v));

/** Utils.createPrimitives defaulted points to half size */
export const DEFAULT_POINT_SCALE = 0.5;
