'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/emag2-1-800x470.png', alt: 'EMAG2 #1' },
  { src: '/img/emag2-2-800x470.png', alt: 'EMAG2 #2' },
];

export default function Emag2Page() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>EMAG2: Earth Magnetic Anomaly Grid</h1>

        <ScreenshotCarousel images={screenshotImages} label="EMAG2 screenshots" />

        <p>
          Magnetic anomaly maps allow us to look into the subsurface structure and composition of the Earth&apos;s
          crust. The magnetic variations in successive bands of ocean floor parallel to the mid-ocean ridges provide
          evidence of the temporal evolution of oceanic crust. The magnetic anomaly is important to the theory of
          seafloor spreading and plate tectonics.
        </p>
        <p>
          The grid of magnetic anomalies is from{' '}
          <a href="https://agupubs.onlinelibrary.wiley.com/doi/abs/10.1029/2009GC002471" target="_blank" rel="noreferrer">
            EMAG2 (Maus et al., 2009)
          </a>. Two colour schemes have been used to render the grid -- RedWhiteBlue and RedGreenBlue. Two versions
          of the grid have been used in the 3D virtual globe. One uses the directional gridding to fill the gaps.
          And the other does not use the directional gridding to fill the gaps. Users can switch the imagery layer
          by clicking the combobox at the top left corner of the 3D globe page. More information, as well as the
          original data sets in their full resolution, can be found at{' '}
          <a href="http://geomag.org/models/emag2.html" target="_blank" rel="noreferrer">
            http://www.geomag.org/models/emag2.html
          </a>.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=EMAG2_V2" target="_blank" rel="noreferrer">
            Explore EMAG2 Grid on 3D Virtual Globe
          </a>
        </p>

        <HowToUseCesium />

        <h2>Reference</h2>
        <p>
          Maus, S., et al. (2009),{' '}
          <a href="https://agupubs.onlinelibrary.wiley.com/doi/abs/10.1029/2009GC002471" target="_blank" rel="noreferrer">
            EMAG2: A 2-arc min resolution Earth Magnetic Anomaly Grid compiled from satellite, airborne, and marine
            magnetic measurements,
          </a>{' '}
          Geochem. Geophys. Geosyst., 10, Q08005, doi:10.1029/2009GC002471.
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
