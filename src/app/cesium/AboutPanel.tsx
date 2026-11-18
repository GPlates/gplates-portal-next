'use client';

import { useEffect } from 'react';
import type { AboutCfg } from './viewConfigs';

/**
 * Port of the old "About This Web Page" jQuery UI dialog, whose content the
 * rift views loaded from static/html/rift_info.html and rift_o_info.html.
 *
 * Views whose About button just pointed at a portal page or a paper use
 * `aboutUrl` and a plain link instead; this is for the two whose text was only
 * ever part of the viewer.
 */
export function AboutPanel({ about, onClose }: { about: AboutCfg; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <section className="cesium-view-info cesium-view-about-panel" aria-label="About this web page">
      <header>
        <h2>About This Web Page</h2>
        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </header>
      {about.paragraphs.map(({ label, text }) => (
        <p key={label}>
          <strong>{label}:</strong> {text}
        </p>
      ))}
      <p>
        <strong>How to cite: </strong>
        <a href={about.cite.url} target="_blank" rel="noreferrer">
          {about.cite.text}
        </a>
      </p>
    </section>
  );
}
