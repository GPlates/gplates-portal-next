import { GWS_URL } from './gws';

/**
 * Port of portal/paleobiodb.py, moved into the browser.
 *
 * The old page posted a query to Django, which fetched PaleoBioDB server-side,
 * looked each point's plate id up in a PostGIS StaticPolygons table, built the
 * GPML with ElementTree and wrote a gzipped file to disk for a second request
 * to download. None of that needs a server any more:
 *
 *  - paleobiodb.org answers with `Access-Control-Allow-Origin: *`, so the
 *    browser can query it directly;
 *  - GWS `reconstruct/assign_points_plate_ids` replaces the StaticPolygons
 *    lookup, and takes every point in one request instead of one each;
 *  - the GPML is plain XML construction, with no pygplates involved.
 */

export type DataType = 'collection' | 'occurrence';

const BASE_URL: Record<DataType, string> = {
  collection: 'https://paleobiodb.org/data1.2/colls/list',
  occurrence: 'https://paleobiodb.org/data1.2/occs/list',
};

/** what the old build_request_url() always asked for */
const SHOW = ['loc', 'time', 'geo', 'coords'];

export type PbdbRecord = {
  lat?: number | string;
  lng?: number | string;
  cid?: string;
  oid?: string;
  env?: string;
  eag?: number | string;
  lag?: number | string;
  idn?: string;
};

/** Port of build_request_url(): filters, then a single comma-joined show=. */
export const buildRequestUrl = (dataType: DataType, filters: Record<string, string>) => {
  const parts = Object.entries(filters).map(([k, v]) => `${k}=${v}`);
  parts.push(`show=${SHOW.join(',')}`);
  return `${BASE_URL[dataType]}.json?${parts.join('&')}`;
};

export async function fetchRecords(
  dataType: DataType,
  filters: Record<string, string>,
): Promise<{ url: string; records: PbdbRecord[] }> {
  const url = buildRequestUrl(dataType, filters);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`PaleoBioDB answered ${response.status}`);
  const data = await response.json();
  return { url, records: (data.records ?? []) as PbdbRecord[] };
}

const num = (v: unknown) => (v === undefined || v === null || v === '' ? null : Number(v));

/**
 * One GWS call for every point, in place of the old per-record PostGIS query.
 * Returns a plate id per record, 0 where the record has no usable coordinates
 * or GWS has no answer -- the same fallback the old code used.
 */
export async function assignPlateIds(records: PbdbRecord[]): Promise<number[]> {
  const indexed = records
    .map((r, i) => ({ i, lat: num(r.lat), lon: num(r.lng) }))
    .filter((r): r is { i: number; lat: number; lon: number } => r.lat !== null && r.lon !== null);

  const plateIds = new Array<number>(records.length).fill(0);
  if (indexed.length === 0) return plateIds;

  const params = new URLSearchParams({
    lats: indexed.map((r) => r.lat).join(','),
    lons: indexed.map((r) => r.lon).join(','),
  });
  const response = await fetch(`${GWS_URL}/reconstruct/assign_points_plate_ids?${params}`);
  if (!response.ok) throw new Error(`GWS answered ${response.status} for plate ids`);
  const ids = (await response.json()) as (number | null)[];

  indexed.forEach((r, n) => {
    const id = ids[n];
    plateIds[r.i] = typeof id === 'number' ? id : 0;
  });
  return plateIds;
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const el = (name: string, children: string, indent: string) =>
  `${indent}<${name}>\n${children}${indent}</${name}>\n`;

const leaf = (name: string, text: string, indent: string) =>
  `${indent}<${name}>${escapeXml(text)}</${name}>\n`;

/** gml:validTime, from get_time_interval(): eag..lag, defaulting to 0. */
const validTime = (record: PbdbRecord, i: string) =>
  el(
    'gml:validTime',
    el(
      'gml:TimePeriod',
      el(
        'gml:begin',
        el('gml:TimeInstant', leaf('gml:timePosition', String(record.eag ?? 0), i + '      '), i + '    '),
        i + '  ',
      ) +
        el(
          'gml:end',
          el('gml:TimeInstant', leaf('gml:timePosition', String(record.lag ?? 0), i + '      '), i + '    '),
          i + '  ',
        ),
      i,
    ),
    i,
  );

/** gpml:occurrence, from create_occurrence(). */
const occurrence = (record: PbdbRecord, i: string) =>
  el(
    'gpml:occurrence',
    el(
      'gpml:FossilOccurrence',
      leaf('gpml:identifiedName', record.idn ?? ' ', i + '    ') +
        leaf('gpml:occurrenceID', record.oid ?? ' ', i + '    '),
      i + '  ',
    ),
    i,
  );

/** gml:featureMember > gpml:FossilCollection, from create_fossil_collection(). */
function fossilCollection(record: PbdbRecord, plateId: number, occurrences: PbdbRecord[]) {
  const i = '    ';
  const lat = num(record.lat);
  const lon = num(record.lng);
  // the old code tested `if lat and lon`, which also skipped a legitimate 0;
  // a null check is used here instead
  const pos = lat !== null && lon !== null ? `${record.lat} ${record.lng}` : '';

  const location = el(
    'gpml:location',
    el(
      'gpml:ConstantValue',
      el('gpml:value', el('gml:Point', leaf('gml:pos', pos, i + '        '), i + '      '), i + '    ') +
        leaf('gpml:valueType', 'gml:Point', i + '    '),
      i + '  ',
    ),
    i,
  );

  const reconstructionPlateId = el(
    'gpml:reconstructionPlateId',
    el(
      'gpml:ConstantValue',
      leaf('gpml:value', String(plateId), i + '    ') +
        leaf('gpml:valueType', 'gpml:plateId', i + '    '),
      i + '  ',
    ),
    i,
  );

  const id = record.cid ?? record.oid ?? '';
  const body =
    location +
    reconstructionPlateId +
    leaf('gpml:fossilCollectionID', id, i) +
    (record.env ? leaf('gpml:environment', record.env, i) : '') +
    validTime(record, i) +
    occurrences.map((o) => occurrence(o, i)).join('');

  return el('gml:featureMember', el('gpml:FossilCollection', body, '  '), '');
}

/**
 * Port of create_feature_collections(). In occurrence mode records sharing a
 * cid become one FossilCollection carrying several gpml:occurrence children,
 * exactly as the old collection_dict did.
 */
export function buildGpml(
  records: PbdbRecord[],
  dataType: DataType,
  plateIds: number[],
): string {
  let members = '';

  if (dataType === 'occurrence') {
    const order: string[] = [];
    const groups = new Map<string, { first: PbdbRecord; plateId: number; items: PbdbRecord[] }>();
    records.forEach((record, index) => {
      const key = record.cid ?? `__${index}`;
      let group = groups.get(key);
      if (!group) {
        group = { first: record, plateId: plateIds[index] ?? 0, items: [] };
        groups.set(key, group);
        order.push(key);
      }
      group.items.push(record);
    });
    members = order
      .map((key) => {
        const g = groups.get(key)!;
        return fossilCollection(g.first, g.plateId, g.items);
      })
      .join('');
  } else {
    members = records.map((r, index) => fossilCollection(r, plateIds[index] ?? 0, [])).join('');
  }

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<gpml:FeatureCollection xmlns:gpml="http://www.gplates.org/gplates"' +
    ' xmlns:gml="http://www.opengis.net/gml"' +
    ' xmlns:xsi="http://www.w3.org/XMLSchema-instance"' +
    ' gpml:version="1.6.0325">\n' +
    members +
    '</gpml:FeatureCollection>\n'
  );
}
