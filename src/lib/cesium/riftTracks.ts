import { TILE_SERVER_URL } from '../tileServer';
import { gunzip } from './gunzip';

/**
 * The dataset behind the three rift views (?view=rift, rift_v, rift_ov).
 *
 * The old portal kept these points in Postgres (portal/rift_obliquity.py over
 * the RiftPoint table) and answered two questions about them: the points at one
 * time, for the globe (/portal/get_rift_points/), and one point's whole history,
 * for the charts and the CSV download (/portal/get_rift_data/). Both are served
 * here from one static file of per-point *tracks*, built by
 * scripts/build_rift_tracks.py and uploaded beside Animations/ and GeoJson/.
 *
 * A track is parallel arrays rather than an array of objects: 81,177 points
 * across 2,220 tracks, so the file is 1.1 MB gzipped this way, and the per-time
 * index below is built once rather than per frame.
 */

export type RiftTrack = {
  /** the old RiftPoint.identifier, and the name of its source CSV */
  id: number;
  /** the times this point exists at, in Ma, oldest last; 368 tracks have gaps */
  t: number[];
  lon: number[];
  lat: number[];
  /** full rift velocity, mm/yr */
  v: number[];
  /** angle of obliquity, degrees */
  o: number[];
};

type RiftTracksFile = {
  format: string;
  timeRange: [number, number];
  tracks: RiftTrack[];
};

export type RiftDataset = {
  tracks: RiftTrack[];
  /** which tracks have a point at each frame, and where in the track it is */
  byTime: Map<number, { track: RiftTrack; index: number }[]>;
};

export const riftTracksUrl = () => `${TILE_SERVER_URL}/rift_obliquity/rift_tracks.json.gz`;

const EXPECTED_FORMAT = 'rift-tracks-1';

// the three rift views share the dataset, so switching between them -- or
// stepping through 241 frames -- must not refetch it
let cached: Promise<RiftDataset> | null = null;

export function loadRiftTracks(): Promise<RiftDataset> {
  return (cached ??= fetchRiftTracks().catch((err) => {
    // don't cache a failure: a later view switch should try again
    cached = null;
    throw err;
  }));
}

async function fetchRiftTracks(): Promise<RiftDataset> {
  const url = riftTracksUrl();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} fetching ${url}`);
  const text = new TextDecoder().decode(await gunzip(await response.arrayBuffer()));
  const file = JSON.parse(text) as RiftTracksFile;
  if (file.format !== EXPECTED_FORMAT) {
    throw new Error(`${url}: expected format ${EXPECTED_FORMAT}, got ${file.format}`);
  }

  const byTime = new Map<number, { track: RiftTrack; index: number }[]>();
  for (const track of file.tracks) {
    track.t.forEach((time, index) => {
      const at = byTime.get(time);
      if (at) at.push({ track, index });
      else byTime.set(time, [{ track, index }]);
    });
  }
  return { tracks: file.tracks, byTime };
}

/**
 * One point's history as CSV, replacing the old /portal/get_rift_data/ (five
 * columns) and /portal/get_rift_data_v/ (four, no obliquity) downloads.
 *
 * Both of those read the rows in the order data/rift_obliquity/points/{id}.csv
 * holds them, which is oldest first -- the reverse of the ascending times a
 * track keeps -- and both printed five decimals.
 */
export function riftTrackCsv(track: RiftTrack, withObliquity: boolean): string {
  const header = withObliquity ? 'time,lon,lat,velocity,obliquity' : 'time,lon,lat,velocity';
  const dp = (v: number) => v.toFixed(5);
  const rows = track.t.map((_, i) => {
    const at = track.t.length - 1 - i;
    const columns = [dp(track.t[at]), dp(track.lon[at]), dp(track.lat[at]), dp(track.v[at])];
    if (withObliquity) columns.push(dp(track.o[at]));
    return columns.join(',');
  });
  return [header, ...rows].join('\n') + '\n';
}

/** the old views named the download after the zero-padded identifier */
export const riftTrackCsvName = (track: RiftTrack) => `${String(track.id).padStart(5, '0')}.csv`;
