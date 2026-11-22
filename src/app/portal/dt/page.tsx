'use client';

import { useEffect, useState } from 'react';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';
import { MODEL_ENTRIES, REFERENCES, viewerUrl } from '../../../lib/dynamicTopography/service';
import './page.css';

/**
 * Port of portal/templates/dt.html: the dynamic topography models grouped by
 * the paper that published them, as collapsible panels. The old Bootstrap
 * accordion becomes <details>; as before, a #<paper name> hash opens that
 * paper, and otherwise the first one starts open.
 */
const PAPERS = REFERENCES.map((ref) => ({
  ...ref,
  models: MODEL_ENTRIES.filter((e) => e.refs.includes(ref.name)),
})).filter((p) => p.models.length > 0);

export default function DynamicTopographyModelsByPaperPage() {
  const [open, setOpen] = useState<string>(PAPERS[0]?.name ?? '');

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && PAPERS.some((p) => p.name === hash)) setOpen(hash);
  }, []);

  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Dynamic Topography</h1>
        <p>
          <strong>Note:</strong> Click the headings to expand or collapse panels.
        </p>

        <div className="dt-papers">
          {PAPERS.map((paper) => (
            <details
              key={paper.name}
              open={open === paper.name}
              onToggle={(e) => {
                const isOpen = (e.currentTarget as HTMLDetailsElement).open;
                if (isOpen) setOpen(paper.name);
                else if (open === paper.name) setOpen('');
              }}
            >
              <summary>{paper.name}</summary>
              <div className="dt-paper-body">
                {/* reference HTML is our own static data, from the old seed script */}
                <p dangerouslySetInnerHTML={{ __html: paper.html }} />
                <ul>
                  {paper.models.map((m) => (
                    <li key={`${m.id}-${m.name}`}>
                      <a href={viewerUrl(m)} target="_blank" rel="noreferrer">
                        {m.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>

        <p>
          <strong>Note:</strong> Click <a href="/portal/dynamic_topography_model_list/">here</a> to see a full list
          of models. This research is supported by{' '}
          <a href="http://www.auscope.org.au/" target="_blank" rel="noreferrer">
            AuScope
          </a>
          .
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
