'use client';

import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';
import './page.css';

const featureCollectionExamples = [
  {
    label: 'Polygon',
    json: `{
    "type":"FeatureCollection",
    "features":
    [{
        "type":"Feature",
        "geometry":
        {
            "type": "Polygon",
            "coordinates": [
                [ [23, -20.0], [-9.0, 35.0],[14.0, 44.0],[23, -20.0] ]
            ]
        },
        "properties":{}
    }]
}`,
  },
  {
    label: 'LineString',
    json: `{
    "type":"FeatureCollection",
    "features":
    [{
        "type":"Feature",
        "geometry":
        {
            "type": "LineString",
            "coordinates": [
                [23, -20.0], [-9.0, 35.0]
            ]
        },
        "properties":{}
    }]
}`,
  },
  {
    label: 'MultiPoint',
    json: `{
    "type":"FeatureCollection",
    "features":
    [{
        "type":"Feature",
        "geometry":
        {
            "type": "MultiPoint",
            "coordinates": [
                [23, -20.0], [-9.0, 35.0],[14.0, 44.0]
            ]
        },
        "properties":{}
    }]
}`,
  },
  {
    label: 'Point',
    json: `{
    "type":"FeatureCollection",
    "features":
    [{
        "type":"Feature",
        "geometry":
        {
            "type":"Point",
            "coordinates":[51.0, 38.0]
        },
        "properties":{}
    }]
}`,
  },
];

export default function ApiRefPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>GPlates Web Service API Reference</h1>

        <section className="api-endpoint">
          <h3>Calculate Paleo-geographic Coordinates</h3>
          <dl>
            <dt>Description</dt>
            <dd>
              Reconstruct the geographic locations from present day coordinates back to their paleo-positions. Each
              location will be assigned a plate id and moved back in time using the chosen reconstruction model.
            </dd>

            <dt>URL</dt>
            <dd><code>http://portal.gplates.org/service/reconstruct_points</code></dd>

            <dt>Parameters</dt>
            <dd>
              <p><strong>points</strong> — The present-day coordinates of locations in longitude and latitude separated by &apos;,&apos;.</p>
              <p>
                <strong>time</strong> — The geological age in million years (Ma) to which the coordinates will be
                reconstructed. The valid input value depends on the chosen reconstruction model.
              </p>
              <p>
                <strong>model</strong> — The reconstruction model name. Models: &quot;default&quot; -- The valid
                time range is between 0 and 440.
              </p>
            </dd>

            <dt>Return</dt>
            <dd>Paleo-coordinates in GeoJson format.</dd>

            <dt>Example</dt>
            <dd>
              The URL below reconstructs two locations ((lon:95,lat:54) (lon:142,lat:-33)) back to 140 million years
              ago using the &quot;default&quot; reconstruction model.
              <br />
              <a href="/service/reconstruct_points/?points=95,54,142,-33&time=140&model=default" target="_blank" rel="noreferrer">
                http://portal.gplates.org/service/reconstruct_points/?points=95,54,142,-33&amp;time=140&amp;model=default
              </a>
              <br />
              <strong>
                <a href="/service/d3_demo/?view=points" target="_blank" rel="noreferrer">
                  Try it in an interactive online map
                </a>
              </strong>
            </dd>
          </dl>
        </section>

        <section className="api-endpoint">
          <h3>Reconstruct Feature Collection</h3>
          <dl>
            <dt>Description</dt>
            <dd>
              Reconstruct feature collection in GeoJSON format back in time. Each feature will be assigned a plate
              id and moved back in time using the given reconstruction model. Reconstructed features will be
              returned in GeoJSON format.
            </dd>

            <dt>URL</dt>
            <dd><code>http://portal.gplates.org/service/reconstruct_feature_collection</code></dd>

            <dt>Parameters</dt>
            <dd>
              <p><strong>feature_collection</strong> — The feature collection in GeoJSON format.</p>
              <p>
                <strong>time</strong> — The time age in million years (Ma) to which the feature collection will be
                reconstructed. The valid input value depends on the chosen reconstruction model.
              </p>
              <p>
                <strong>model</strong> — The reconstruction model name. Models: &quot;default&quot; -- The valid
                time range is between 0 and 440.
              </p>
            </dd>

            <dt>Return</dt>
            <dd>Feature collection in GeoJson format.</dd>

            <dt>Example</dt>
            <dd>
              <a
                href={
                  'http://portal.gplates.org/service/reconstruct_feature_collection/?feature_collection=' +
                  '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon",' +
                  '"coordinates":[[[23,-20],[-9,35],[14,44],[23,-20]]]},"properties":{}}]}&time=140&model=default'
                }
                target="_blank"
                rel="noreferrer"
              >
                http://portal.gplates.org/service/reconstruct_feature_collection/?feature_collection=...&amp;time=140&amp;model=default
              </a>
              <br />
              <strong>
                <a href="/service/d3_demo/?view=feature_collection" target="_blank" rel="noreferrer">
                  Try it in an interactive online map
                </a>
              </strong>
            </dd>

            <dt>Feature Collection Examples</dt>
            <dd>
              {featureCollectionExamples.map((example) => (
                <div key={example.label}>
                  <p><strong>#{example.label}</strong></p>
                  <pre>{example.json}</pre>
                </div>
              ))}
            </dd>
          </dl>
        </section>

        <section className="api-endpoint">
          <h3>Reconstruct Coastlines</h3>
          <dl>
            <dt>Description</dt>
            <dd>Return the coastlines&apos; paleo-coordinates.</dd>

            <dt>URL</dt>
            <dd><code>http://portal.gplates.org/service/get_coastline_polygons</code></dd>

            <dt>Parameters</dt>
            <dd>
              <p>
                <strong>time</strong> — The geological age in million years (Ma). The valid input value depends on
                the chosen reconstruction model.
              </p>
              <p>
                <strong>model</strong> — The reconstruction model name (optional). Models: &quot;default&quot; --
                The valid time range is between 0 and 440.
              </p>
            </dd>

            <dt>Return</dt>
            <dd>Feature collection in GeoJSON format.</dd>

            <dt>Example</dt>
            <dd>
              <a href="/service/get_coastline_polygons/?time=140" target="_blank" rel="noreferrer">
                http://portal.gplates.org/service/get_coastline_polygons/?time=140
              </a>
              <br />
              <strong>
                <a href="/service/d3_demo/" target="_blank" rel="noreferrer">
                  Try it in an interactive online map
                </a>
              </strong>
            </dd>
          </dl>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
