'use client';

import { useState } from 'react';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';
import {
  assignPlateIds,
  buildGpml,
  fetchRecords,
  type DataType,
} from '../../../lib/paleobiodb';
import { COUNTRIES, DEFAULT_COUNTRY } from './countries';
import './page.css';

/**
 * Port of portal/paleobiodb.py::index + static/html/paleobiodb.html.
 *
 * The old page was a query builder whose only action posted to Django, which
 * built the GPML server-side and left a gzipped file for a second request to
 * download. All of that now happens in the browser -- see src/lib/paleobiodb.ts
 * for why none of it needs a backend.
 */
const CONTINENTS = [
  { code: 'AFR', name: 'Africa' },
  { code: 'ASI', name: 'Asia' },
  { code: 'AUS', name: 'Australia' },
  { code: 'EUR', name: 'Europe' },
  { code: 'NOA', name: 'North America' },
  { code: 'SOA', name: 'South America' },
  { code: 'ATA', name: 'Antarctica' },
  { code: 'IOC', name: 'Indian Ocean' },
  { code: 'OCE', name: 'Oceania' },
];

/** the four the old page offered, with PaleoBioDB's interval ids */
const PERIODS = [
  { id: '-1', name: 'N/A' },
  { id: '15', name: 'Jurassic' },
  { id: '22', name: 'Cambrian' },
  { id: '17', name: 'Permian' },
];

type Status =
  | { kind: 'idle' }
  | { kind: 'working'; message: string }
  | { kind: 'ready'; href: string; fileName: string; count: number; url: string }
  | { kind: 'error'; message: string };

export default function PaleobiodbPage() {
  const [dataType, setDataType] = useState<DataType>('collection');

  const [useContinent, setUseContinent] = useState(false);
  const [continent, setContinent] = useState('AFR');
  const [useCountry, setUseCountry] = useState(true);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [useRegion, setUseRegion] = useState(false);
  const [region, setRegion] = useState({ lngmin: '', lngmax: '', latmin: '', latmax: '' });
  const [usePeriod, setUsePeriod] = useState(true);
  const [period, setPeriod] = useState('15');
  const [useInterval, setUseInterval] = useState(false);
  const [interval, setInterval] = useState({ max_ma: '', min_ma: '' });
  const [assignPlateId, setAssignPlateId] = useState(false);

  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const createGpml = async () => {
    setStatus({ kind: 'working', message: 'Retrieving data from the Paleobiology Database…' });
    try {
      const filters: Record<string, string> = {};
      if (useCountry && country) filters.country = country;
      if (useContinent && continent) filters.cc = continent;
      if (useRegion) {
        filters.lngmin = region.lngmin;
        filters.lngmax = region.lngmax;
        filters.latmin = region.latmin;
        filters.latmax = region.latmax;
      }
      if (usePeriod) filters.interval_id = period;
      if (useInterval) {
        filters.max_ma = interval.max_ma;
        filters.min_ma = interval.min_ma;
      }

      const { url, records } = await fetchRecords(dataType, filters);
      if (records.length === 0) {
        setStatus({ kind: 'error', message: 'That query returned no records. Try widening it.' });
        return;
      }

      let plateIds = new Array<number>(records.length).fill(0);
      if (assignPlateId) {
        setStatus({ kind: 'working', message: `Assigning plate ids to ${records.length} records…` });
        plateIds = await assignPlateIds(records);
      }

      setStatus({ kind: 'working', message: 'Building the GPML file…' });
      const gpml = buildGpml(records, dataType, plateIds);
      const href = URL.createObjectURL(new Blob([gpml], { type: 'application/xml' }));
      setStatus({
        kind: 'ready',
        href,
        fileName: 'paleobiodb_data.gpml',
        count: records.length,
        url,
      });
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong.',
      });
    }
  };

  const working = status.kind === 'working';

  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1>Paleobiology Database</h1>

        <p>
          Build a GPML file from{' '}
          <a href="https://paleobiodb.org" target="_blank" rel="noreferrer">
            the Paleobiology Database
          </a>
          . Choose which fossil collections or occurrences you want, and the file is assembled in
          your browser and offered as a download. Open it in{' '}
          <a href="https://www.gplates.org" target="_blank" rel="noreferrer">
            GPlates
          </a>
          .
        </p>

        <div className="pbdb-options">
          <div className="pbdb-row">
            <label htmlFor="data-type">Data Type:</label>
            <select
              id="data-type"
              value={dataType}
              onChange={(e) => setDataType(e.target.value as DataType)}
            >
              <option value="collection">Fossil Collections</option>
              <option value="occurrence">Fossil Occurrences</option>
            </select>
            <span />
          </div>

          <div className="pbdb-row">
            <label htmlFor="continent">Continent:</label>
            <select
              id="continent"
              value={continent}
              disabled={!useContinent}
              onChange={(e) => setContinent(e.target.value)}
            >
              <option value="">--</option>
              {CONTINENTS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="checkbox"
              checked={useContinent}
              onChange={(e) => setUseContinent(e.target.checked)}
              aria-label="Filter by continent"
            />
          </div>

          <div className="pbdb-row">
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              value={country}
              disabled={!useCountry}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">--</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <input
              type="checkbox"
              checked={useCountry}
              onChange={(e) => setUseCountry(e.target.checked)}
              aria-label="Filter by country"
            />
          </div>

          <div className="pbdb-row">
            <label>Region:</label>
            <div className="pbdb-region">
              {(['lngmin', 'lngmax', 'latmin', 'latmax'] as const).map((key) => (
                <input
                  key={key}
                  value={region[key]}
                  disabled={!useRegion}
                  placeholder={
                    { lngmin: 'Longitude Min', lngmax: 'Longitude Max', latmin: 'Latitude Min', latmax: 'Latitude Max' }[key]
                  }
                  title={
                    { lngmin: 'Longitude Min', lngmax: 'Longitude Max', latmin: 'Latitude Min', latmax: 'Latitude Max' }[key]
                  }
                  onChange={(e) => setRegion({ ...region, [key]: e.target.value })}
                />
              ))}
            </div>
            <input
              type="checkbox"
              checked={useRegion}
              onChange={(e) => setUseRegion(e.target.checked)}
              aria-label="Filter by region"
            />
          </div>

          <div className="pbdb-row">
            <label htmlFor="period">Geologic Period:</label>
            <select
              id="period"
              value={period}
              disabled={!usePeriod}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {PERIODS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="checkbox"
              checked={usePeriod}
              onChange={(e) => setUsePeriod(e.target.checked)}
              aria-label="Filter by geologic period"
            />
          </div>

          <div className="pbdb-row">
            <label>Time Interval:</label>
            <div className="pbdb-interval">
              <input
                value={interval.max_ma}
                disabled={!useInterval}
                placeholder="Oldest"
                title="Oldest Time"
                onChange={(e) => setInterval({ ...interval, max_ma: e.target.value })}
              />
              <span>Ma</span>
              <input
                value={interval.min_ma}
                disabled={!useInterval}
                placeholder="Youngest"
                title="Youngest Time"
                onChange={(e) => setInterval({ ...interval, min_ma: e.target.value })}
              />
              <span>Ma</span>
            </div>
            <input
              type="checkbox"
              checked={useInterval}
              onChange={(e) => setUseInterval(e.target.checked)}
              aria-label="Filter by time interval"
            />
          </div>

          <div className="pbdb-row">
            <span />
            <span className="pbdb-note">Use default static polygons to assign plate id</span>
            <input
              type="checkbox"
              checked={assignPlateId}
              onChange={(e) => setAssignPlateId(e.target.checked)}
              aria-label="Assign plate ids"
            />
          </div>
        </div>

        <p className="pbdb-actions">
          <button type="button" className="legacy-success-btn" disabled={working} onClick={createGpml}>
            Create GPML File
          </button>
        </p>

        {status.kind === 'working' && <div className="pbdb-alert pbdb-info">{status.message}</div>}

        {status.kind === 'error' && <div className="pbdb-alert pbdb-error">{status.message}</div>}

        {status.kind === 'ready' && (
          <div className="pbdb-alert pbdb-success">
            <p>
              The GPML file is ready — {status.count} record{status.count === 1 ? '' : 's'}.{' '}
              <a className="legacy-success-btn" href={status.href} download={status.fileName}>
                Download GPML File
              </a>
            </p>
            <p className="pbdb-query">
              Queried:{' '}
              <a href={status.url} target="_blank" rel="noreferrer">
                {status.url}
              </a>
            </p>
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
