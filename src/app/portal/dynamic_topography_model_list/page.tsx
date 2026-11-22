'use client';

import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';
import { MODEL_ENTRIES, REFERENCES, viewerUrl } from '../../../lib/dynamicTopography/service';
import '../dt/page.css';

/**
 * Port of portal/templates/dynamic_topography_model_list.html: every public
 * dynamic topography model in three columns, then the references and the
 * AuScope acknowledgement. The old "Login to see more private models" note is
 * gone: this site has no login yet, so it lists public models only.
 */
export default function DynamicTopographyModelListPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Dynamic Topography Models</h1>

        <ul className="dt-model-columns">
          {MODEL_ENTRIES.map((m) => (
            <li key={`${m.id}-${m.name}`}>
              <a href={viewerUrl(m)} target="_blank" rel="noreferrer">
                {m.name}
              </a>
            </li>
          ))}
        </ul>

        <h2>References</h2>
        <ul>
          {REFERENCES.map((ref) => (
            // reference HTML is our own static data, from the old seed script
            <li key={ref.name} dangerouslySetInnerHTML={{ __html: ref.html }} />
          ))}
        </ul>

        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
          This research is supported by{' '}
          <a href="http://www.auscope.org.au/" target="_blank" rel="noreferrer">
            AuScope
          </a>
          .
        </p>
        <div className="dt-sponsor">
          <a href="http://www.auscope.org.au/" target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="AuScope Logo" src="/img/AuScope-logo.png" />
          </a>
          <p>
            <strong>AuScope</strong> was designed to put Australia at the forefront of international geoscience and
            geospatial research and to create geoscience applications for the next generation. Its aim was to assist
            in building Australia&apos;s wealth through improved and sustainable discovery, development and management
            of our minerals, energy and groundwater assets. It provides a step-change in our ability to spatially map
            Australia&apos;s location and internal deformation, in particular enhancing our ability to contribute to
            natural hazard prediction and management, both here and for our immediate neighbours.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
