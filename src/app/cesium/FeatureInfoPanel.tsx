'use client';

import { useEffect } from 'react';
import { PickableFeature, infoRows } from '../../lib/cesium/pickableGeoJson';
import { legacyPortalUrl } from '../../lib/cesium/legacyPortal';
import type { FeaturesCfg } from './viewConfigs';

/** Port of the old #entity-info-panel jQuery UI dialog. */
export function FeatureInfoPanel({
  feature,
  cfg,
  onClose,
}: {
  feature: PickableFeature;
  cfg: FeaturesCfg;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const { properties } = feature;
  const title = cfg.showIdInTitle ? `${feature.name} (ID: ${properties.ID})` : feature.name;
  const rows = infoRows(properties, cfg.infoFields);
  const url = typeof properties.URL === 'string' && properties.URL ? properties.URL : null;

  return (
    <section className="cesium-view-info" aria-label="Feature information">
      <header>
        <h2>{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </header>
      {rows.length > 0 && (
        <table>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {url && (
        <a href={legacyPortalUrl(url)} target="_blank" rel="noreferrer">
          More information &raquo;
        </a>
      )}
    </section>
  );
}
