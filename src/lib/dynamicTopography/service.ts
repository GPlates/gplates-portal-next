/**
 * Dynamic topography data for the viewer: the globe images and the profile
 * (elevation through time at one point).
 *
 * On the old portal both came from Django: get_dynamic_topography_raster sent
 * a pre-rendered JPEG per model/time/frame, and dynamic_topography_profile
 * shelled out to DynamicTopographyProfile.py, which sampled every .nc grid at
 * the point and drew a matplotlib PNG. The new portal draws the chart itself,
 * so it only needs the numbers -- and sampling grids is the part moving into
 * GPlates Web Service.
 *
 * Until that GWS endpoint exists the profile is *generated* here (see
 * fakeProfile); set NEXT_PUBLIC_DT_PROFILE_SOURCE=gws to call the real one.
 * docs/dynamic-topography-gws-api.md is the contract for the GWS side.
 */
import { GWS_URL } from '../gws';
import { TILE_SERVER_URL } from '../tileServer';
import catalogue from './models.json';

export type Frame = 'plate' | 'plate_co' | 'mantle';

export const FRAME_LABELS: Record<Frame, string> = {
  plate_co: 'Plate Reference Frame (Continent Only)',
  plate: 'Plate Reference Frame',
  mantle: 'Mantle Reference Frame',
};

export type ModelInfo = {
  /** grid file names on the server, e.g. "0", "4.50" -- kept verbatim */
  times: string[];
  /** a masked "continent only" image set exists */
  continentOnly: boolean;
  /** the old viewer linked to the grids and reconstruction files on earthbyte.org */
  downloads: boolean;
  legend: string;
  unit: 'm' | 'm/Ma';
};

export type ModelEntry = { id: string; name: string; refs: string[] };
export type Reference = { name: string; title: string; html: string };

export const MODELS = catalogue.models as Record<string, ModelInfo>;
export const MODEL_ENTRIES = catalogue.entries as ModelEntry[];
export const REFERENCES = catalogue.references as Reference[];

export function viewerUrl(entry: ModelEntry) {
  return `/dynamic_topography_cesium/?model=${encodeURIComponent(entry.id)}&name=${encodeURIComponent(entry.name)}`;
}

// ---- globe images -------------------------------------------------------

/**
 * Where the JPEGs come from.
 *
 * "legacy" (the default for now): the old portal's get_dynamic_topography_raster,
 * reached through the /legacy-portal rewrite in next.config.mjs. The old portal
 * sends no CORS header, and Cesium needs one to use an image as a texture, so
 * it has to be same-origin.
 *
 * "tiles": static files on the data server, like every other raster the
 * portal shows. Switch to this once Models/<id>/{PlateFrame,MantleFrame}/*.jpg
 * are copied under DynamicTopography/ on repo.gplates.org.
 */
const RASTER_SOURCE = process.env.NEXT_PUBLIC_DT_RASTER_SOURCE === 'tiles' ? 'tiles' : 'legacy';

export function rasterUrl(model: string, time: string, frame: Frame) {
  if (RASTER_SOURCE === 'tiles') {
    const dir = frame === 'mantle' ? 'MantleFrame' : 'PlateFrame';
    const file = frame === 'plate_co' ? `Masked_${time}.jpg` : `${time}.jpg`;
    return `${TILE_SERVER_URL}/DynamicTopography/Models/${model}/${dir}/${file}`;
  }
  const params = new URLSearchParams({ model, time, frame });
  return `/legacy-portal/get_dynamic_topography_raster?${params}`;
}

// ---- profile ------------------------------------------------------------

export type Profile = {
  model: string;
  lon: number;
  lat: number;
  frame: Frame;
  unit: ModelInfo['unit'];
  times: number[];
  /** null where the grid has no value, as the old NaN */
  values: (number | null)[];
  /** true while the numbers are generated rather than sampled */
  fake: boolean;
};

const PROFILE_SOURCE = process.env.NEXT_PUBLIC_DT_PROFILE_SOURCE === 'gws' ? 'gws' : 'fake';
export const PROFILE_IS_FAKE = PROFILE_SOURCE === 'fake';

export async function fetchProfile(
  model: string,
  lon: number,
  lat: number,
  frame: Exclude<Frame, 'mantle'>,
  signal?: AbortSignal,
): Promise<Profile> {
  if (PROFILE_IS_FAKE) return fakeProfile(model, lon, lat, frame, signal);

  const params = new URLSearchParams({
    model,
    lon: lon.toFixed(2),
    lat: lat.toFixed(2),
    frame,
  });
  const response = await fetch(`${GWS_URL}/raster/dynamic_topography/profile?${params}`, { signal });
  if (!response.ok) throw new Error(`${response.status} from GWS dynamic_topography/profile`);
  const body = await response.json();
  return {
    model,
    lon,
    lat,
    frame,
    unit: body.unit,
    times: body.times,
    values: body.values,
    fake: false,
  };
}

/**
 * Stand-in for the GWS endpoint: same shape, made-up numbers.
 *
 * The values are smooth in space and time (a few long-wavelength waves, as
 * dynamic topography is) and repeatable for a given model and point, so the
 * chart behaves like the real thing while the UI is built. They are not data
 * and the viewer says so on the chart.
 */
async function fakeProfile(
  model: string,
  lon: number,
  lat: number,
  frame: Exclude<Frame, 'mantle'>,
  signal?: AbortSignal,
): Promise<Profile> {
  const info = MODELS[model];
  if (!info) throw new Error(`unknown model ${model}`);

  // a short wait, so loading states get exercised
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 400);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('aborted', 'AbortError'));
    });
  });

  const seed = [...model].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) / 2 ** 32;
  const rad = Math.PI / 180;
  const times = info.times.map(Number);
  const maxTime = Math.max(...times, 1);
  const rate = info.unit === 'm/Ma';

  const values = times.map((t) => {
    const s = t / maxTime;
    // drift the pattern eastward through time, as the plate frame does
    const x = (lon + 60 * s + 360 * seed) * rad;
    const y = lat * rad;
    const z =
      600 * Math.sin(2 * x + 3 * seed) * Math.cos(y) +
      350 * Math.cos(3 * y + 2 * s + seed) +
      200 * Math.sin(x - 2 * y + 4 * s);
    const value = rate ? z / 40 : z - 200 * s;
    return Math.round(value * 10) / 10;
  });

  return { model, lon, lat, frame, unit: info.unit, times, values, fake: true };
}

/** the old download_dynamic_topography_profile CSV, byte for byte in layout */
export function profileCsv(profile: Profile) {
  const lines = [`#Lon: ${profile.lon}, Lat: ${profile.lat}`, '#Time,Elevation '];
  if (profile.fake) lines.unshift('#SAMPLE DATA - generated values, not model output');
  profile.times.forEach((t, i) => {
    const v = profile.values[i];
    lines.push(`${t},${v === null ? 'nan' : v}`);
  });
  return lines.join('\n') + '\n';
}
