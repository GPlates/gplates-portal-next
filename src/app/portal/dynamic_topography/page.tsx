'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/dt-1-800x470.png', alt: 'dynamic topography #1' },
  { src: '/img/dt-2-800x470.png', alt: 'dynamic topography #2' },
];

export default function DynamicTopographyPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Dynamic Topography</h1>

        <ScreenshotCarousel images={screenshotImages} label="Dynamic Topography screenshots" />

        <p>
          The topography of Earth is primarily controlled by lateral differences in the density structure of the
          crust and lithosphere. In addition to this isostatic topography, flow in the mantle induces deformation of
          its surface leading to dynamic topography [1].
        </p>
        <p>
          In this web application, a series of time-dependent global dynamic topography rasters are projected onto
          a map view, which allows users to explore the dynamic topography data interactively. Three view modes are
          available -- 3D globe, 2D map and Columbus. A time slider and drop menu allow users to jump back and
          forth in time. Two reference frames are provided -- plate reference frame and mantle reference frame. And
          users can click a location on the map to view the dynamic topography profile over time.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/portal/dynamic_topography_model_list/" target="_blank" rel="noreferrer">
            Check Out the Models
          </a>
        </p>

        <p>
          The dynamic topography models are provided by{' '}
          <a href="http://www.earthbyte.org/contacts.html" target="_blank" rel="noreferrer">EarthByte Group</a>{' '}
          along with its sponsors and collaborators.
        </p>
        <p>
          The 3D visualization is powered by{' '}
          <a href="http://cesiumjs.org/" target="_blank" rel="noreferrer">Cesium</a>.
        </p>

        <HowToUseCesium />

        <h2>References</h2>
        <ul>
          <li>
            [1] Flament, Nicolas, Gurnis, Micheal, and R. Dietmar Müller.{' '}
            <a href="http://earthbyte.org/Resources/Flament-et-al-2013_DynamicTopography.html" target="_blank" rel="noreferrer">
              A review of observations and models of dynamic topography.
            </a>{' '}
            Lithosphere 5.2 (2013): 189-210, doi: 10.1130/L245.1
          </li>
        </ul>
      </div>
      <SiteFooter />
    </main>
  );
}
