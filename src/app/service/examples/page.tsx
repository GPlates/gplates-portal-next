'use client';

import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

export default function ServiceExamplesPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>GPlates Web Services Examples</h1>
        <p style={{ textAlign: 'center' }}>
          This page contains examples of using GPlates Web Services under various circumstances.
        </p>

        <h2 style={{ textAlign: 'center' }}>QGIS</h2>
        <p style={{ textAlign: 'center' }}>
          Step 1: Click menu item &quot;Layer &rarr; Add Layer &rarr; Add Vector Layer&quot;
        </p>
        <p style={{ textAlign: 'center' }}>
          <img src="/img/qgis-example-1.jpg" alt="QGIS Examples #1" style={{ maxWidth: '100%' }} />
        </p>
        <p style={{ textAlign: 'center' }}>
          Step 2: In the popup dialog, choose &quot;Protocol&quot; as &quot;Source Type&quot; and type in the URI,
          for example http://portal.gplates.org/service/get_coastline_polygons/?time=50.
        </p>
        <p style={{ textAlign: 'center' }}>
          <img src="/img/qgis-example-2.jpg" alt="QGIS Examples #2" style={{ maxWidth: '100%' }} />
        </p>
        <p style={{ textAlign: 'center' }}>
          Step 3: Click &quot;Open&quot; button and the reconstructed coastlines will show in QGIS.
        </p>
        <p style={{ textAlign: 'center' }}>
          <img src="/img/qgis-example-3.jpg" alt="QGIS Examples #3" style={{ maxWidth: '100%' }} />
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
