'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/gsfml-1-800x470.png', alt: 'Magnetic Picks #1' },
  { src: '/img/gsfml-2-800x470.png', alt: 'Magnetic Picks #2' },
];

export default function GsfmlPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Magnetic Picks</h1>

        <ScreenshotCarousel images={screenshotImages} label="Magnetic Picks screenshots" />

        <p>
          A collection of published magnetic anomaly and fracture zone picks for tectonic reconstruction are
          plotted on a 3D globe with a greyscale raster of{' '}
          <a href="http://topex.ucsd.edu/grav_outreach/" target="_blank" rel="noreferrer">
            Vertical Gravity Gradient
          </a>{' '}
          in the background. The picks are coloured by the chron name and the end of anomaly. This web application
          allows users to explore magnetic picks interactively on a 3D globe.
        </p>
        <p>
          For more information about the picks, click{' '}
          <a href="http://www.soest.hawaii.edu/PT/GSFML/ML/index.html" target="_blank" rel="noreferrer">here</a>.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=GSFML" target="_blank" rel="noreferrer">
            View Picks in 3D Globe
          </a>
        </p>

        <HowToUseCesium />
      </div>
      <SiteFooter />
    </main>
  );
}
