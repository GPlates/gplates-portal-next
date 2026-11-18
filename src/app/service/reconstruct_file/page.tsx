'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';
import { GWS_URL } from '../../../lib/gws';
import './page.css';

/**
 * Port of service/templates/reconstruct_file_page.html, at /service/reconstruct_file
 * (the old URL was /service/reconstruct_file_page).
 *
 * The old form already posted straight to GWS rather than to Django, so this
 * page has no backend of its own to wait on. It stays a native multipart form
 * POST with target="_blank" -- not a fetch() -- because a form post is not
 * subject to CORS and the browser handles the returned zip as a download by
 * itself. Only the base URL is parameterised, via NEXT_PUBLIC_GWS_URL.
 */
const RECONSTRUCT_FILES_URL = `${GWS_URL}/reconstruct/reconstruct_files`;

/** the old page's client-side cap, enforced before the form is submitted */
const MAX_TOTAL_BYTES = 4000000;

const MODELS = [
  'SETON2012',
  'MULLER2016',
  'GOLONKA',
  'PALEOMAP',
  'MATTHEWS2016',
  'RODINIA2013',
];

export default function ReconstructFilePage() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      setFileNames([]);
      return;
    }

    const totalSize = files.reduce((total, file) => total + file.size, 0);
    if (totalSize > MAX_TOTAL_BYTES) {
      window.alert('The total size of files cannot exceed 4MB.');
      setFileNames([]);
      return;
    }

    setFileNames(files.map((file) => file.name));
  };

  const ready = fileNames.length > 0;

  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Plate Reconstruction Service</h1>

        <p>
          This &quot;Plate Reconstruction Service&quot; is created and maintained by{' '}
          <a href="https://www.earthbyte.org" target="_blank" rel="noreferrer">
            EarthByte
          </a>{' '}
          group at the University of Sydney. It is a part of{' '}
          <a href="https://gws.gplates.org" target="_blank" rel="noreferrer">
            GPlates Web Service
          </a>{' '}
          and{' '}
          <a href="http://portal.gplates.org" target="_blank" rel="noreferrer">
            GPlates Web Portal
          </a>
          . Only{' '}
          <a
            href="https://doc.arcgis.com/en/arcgis-online/reference/shapefiles.htm"
            target="_blank"
            rel="noreferrer"
          >
            Shapefiles
          </a>{' '}
          and{' '}
          <a href="https://www.gplates.org/gpml.html" target="_blank" rel="noreferrer">
            GPML
          </a>{' '}
          files are currently supported. The GPML stands for the &quot;GPlates Markup Language&quot;,
          the native file format of GPlates. Your files will be uploaded to a GPlates server and
          reconstructed by using{' '}
          <a
            href="https://www.gplates.org/docs/pygplates/pygplates_getting_started.html"
            target="_blank"
            rel="noreferrer"
          >
            pyGPlates
          </a>{' '}
          Python library. The result is returned in Shapefiles format in a zip file. Several{' '}
          <a href="https://gwsdoc.gplates.org/reconstruction-models" target="_blank" rel="noreferrer">
            reconstruction models
          </a>{' '}
          are available.{' '}
          <a href="https://www.earthbyte.org/contact-us-3/" target="_blank" rel="noreferrer">
            Contact us
          </a>{' '}
          for more information about the reconstruction models and the &quot;Plate Reconstruction
          Service&quot;.
        </p>

        <p>
          A Python example of using this service can be found at{' '}
          <a
            href="https://github.com/GPlates/gplates-web-service/blob/master/examples/reconstruct_files_with_web_service.py"
            target="_blank"
            rel="noreferrer"
          >
            https://github.com/GPlates/gplates-web-service/blob/master/examples/reconstruct_files_with_web_service.py
          </a>
          .
        </p>

        <p>
          The documentation of programmatic interface of this service is at{' '}
          <a
            href="https://gwsdoc.gplates.org/reconstruction/reconstruct-file"
            target="_blank"
            rel="noreferrer"
          >
            https://gwsdoc.gplates.org/reconstruction/reconstruct-file
          </a>
          .
        </p>

        <p>
          <strong>How to use:</strong>
        </p>
        <ul>
          <li>Step 1: Click &quot;Choose Files&quot; button and choose your Shapefiles</li>
          <li>Step 2: Choose &quot;Reconstruction Time&quot; and &quot;Reconstruction Model&quot;</li>
          <li>
            Step 3: Click &quot;Reconstruct &amp; Download&quot; button and wait for the result file
          </li>
        </ul>

        <p>
          You can download the shapefiles for test at{' '}
          <a
            href="https://github.com/GPlates/gplates-web-service/blob/master/examples/data/Australia_Points.zip"
            target="_blank"
            rel="noreferrer"
          >
            Australia_Points.zip
          </a>
        </p>

        <form
          ref={formRef}
          className="reconstruct-form"
          method="POST"
          encType="multipart/form-data"
          action={RECONSTRUCT_FILES_URL}
          target="_blank"
        >
          <div className="reconstruct-field">
            <label htmlFor="time">Reconstruction Time:</label>
            <input id="time" name="time" defaultValue="100" />
            <span className="reconstruct-unit">Ma</span>
          </div>
          <div className="reconstruct-field">
            <label htmlFor="model">Reconstruction Model:</label>
            <select id="model" name="model" defaultValue="SETON2012">
              {MODELS.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            id="selected-files"
            name="files[]"
            multiple
            hidden
            onChange={handleFilesChange}
          />
        </form>

        <p className="reconstruct-actions">
          <button type="button" className="legacy-info-btn" onClick={() => fileInputRef.current?.click()}>
            Choose Files
          </button>{' '}
          <button
            type="button"
            className="legacy-success-btn"
            disabled={!ready}
            onClick={() => formRef.current?.requestSubmit()}
          >
            Reconstruct &amp; Download
          </button>
        </p>

        <div className="reconstruct-files">
          {ready ? (
            <ul>
              {fileNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          ) : (
            <div className="reconstruct-empty">
              <span>The file list is empty.</span>
              <br />
              <span>
                Click the &quot;Choose Files&quot; button above to choose the files to reconstruct
                through time.
              </span>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
