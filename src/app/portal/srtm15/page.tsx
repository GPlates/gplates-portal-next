'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/topo15-1-800x470.png', alt: 'SRTM15 #1' },
  { src: '/img/topo15-2-800x470.png', alt: 'SRTM15 #2' },
  { src: '/img/topo15-3-800x470.png', alt: 'SRTM15 #3' },
  { src: '/img/topo15-4-800x470.png', alt: 'SRTM15 #4' },
];

export default function Srtm15Page() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>SRTM15_PLUS</h1>

        <ScreenshotCarousel images={screenshotImages} label="SRTM15_PLUS screenshots" />

        <p>
          The SRTM15_PLUS data fusion consists of SRTM land topography with measured and estimated seafloor
          topography. This web application allows users to explore SRTM15_PLUS data interactively on a 3D globe.
          The imagery raster is created by applying ETOPO1 colour scheme to SRTM15_PLUS data. And the topography is
          visualized via terrain vertical exaggeration.
        </p>
        <p>
          For more information about SRTM15_PLUS data, click{' '}
          <a href="https://topex.ucsd.edu/WWW_html/srtm15_plus.html" target="_blank" rel="noreferrer">here</a>.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=topo15" target="_blank" rel="noreferrer">
            View Topography on 3D Globe
          </a>
        </p>

        <HowToUseCesium />
      </div>
      <SiteFooter />
    </main>
  );
}
