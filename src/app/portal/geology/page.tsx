'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/geology-1-800x470.png', alt: 'Geology #1' },
  { src: '/img/geology-2-800x470.png', alt: 'Geology #2' },
];

export default function GeologyPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Geological Map of the World and its Reconstruction</h1>

        <ScreenshotCarousel images={screenshotImages} label="Geology screenshots" />

        <p>
          This third edition of the Geological Map of the World at the scale of 1:50,000,000 (1:50 M) follows the
          first and second editions published by the CGMW respectively in 1990 and 2000. It is a tentative and
          (very) simplified representation of the entire solid surface of our planet and includes both continental
          and oceanic domains.
        </p>
        <p>
          Two virtual globes have been created. In the present-day globe, the geological map is draped over{' '}
          <a href="https://topex.ucsd.edu/WWW_html/srtm15_plus.html" target="_blank" rel="noreferrer">
            srtm15_plus
          </a>{' '}
          topography data. In the reconstruction globe, the geological map has been reconstructed back in time
          using <a href="http://www.gplates.org" target="_blank" rel="noreferrer">GPlates</a>.
        </p>
        <p>
          For more information, click{' '}
          <a
            href="https://ccgm.org/en/home/164-carte-geologique-du-monde-a-l-echelle-de-135-000-000-9782917310243.html"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=Geology" target="_blank" rel="noreferrer">
            View Present-day Geological Map of the World in 3D Globe
          </a>
        </p>
        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=GeologyR" target="_blank" rel="noreferrer">
            View the Reconstruction of Geological Map in 3D Globe
          </a>
        </p>

        <h2 style={{ textAlign: 'center' }}>Geological Map Legend</h2>
        <p style={{ textAlign: 'center' }}>
          <a href="/img/world_geology_legend.jpg" target="_blank" rel="noreferrer">
            <img
              src="/img/world_geology_legend.jpg"
              alt="geological map legend"
              style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}
            />
          </a>
        </p>

        <HowToUseCesium />

        <h2>References</h2>
        <ul>
          <li>
            Bouysse, Philippe and colleagues at Commission for the Geological Map of the World. 2010.{' '}
            <a
              href="https://ccgm.org/en/home/164-carte-geologique-du-monde-a-l-echelle-de-135-000-000-9782917310243.html"
              target="_blank"
              rel="noreferrer"
            >
              Geological map of the world: scale 1: 35 000 000
            </a>. CGMW.
          </li>
          <li>
            <strong>The reconstructions are primarily based on this plate model:</strong>
            <br />
            Seton, M., Müller R.D., Zahirovic, S., Gaina, C., Torsvik, T., Shephard, G.E., Talsma, A., Gurnis, M.,
            Turner, M., and Chandler, M., 2012,{' '}
            <a
              href="http://www.sciencedirect.com/science/article/pii/S0012825212000311"
              target="_blank"
              rel="noreferrer"
            >
              Global continental and ocean basin reconstructions since 200 Ma
            </a>, Earth Science Reviews, 113, 212–270
          </li>
          <li>
            <strong>with modifications in the circum-Arctic region from:</strong>
            <br />
            Shephard, G.E., Müller, R.D. and Seton, M., 2013,{' '}
            <a
              href="http://www.sciencedirect.com/science/article/pii/S0012825213001104"
              target="_blank"
              rel="noreferrer"
            >
              The tectonic evolution of the Arctic since Pangea breakup: Integrating constraints from surface
              geology and geophysics with mantle structure
            </a>, Earth Science Reviews, 124, 148-183, 2013.
          </li>
          <li>
            <strong>and modifications in the Indian Ocean from:</strong>
            <br />
            Gibbons, A.D., Zahirovic, S., Müller, R.D., Whittaker, J.M., Yatheesh, V., 2015,{' '}
            <a
              href="http://www.sciencedirect.com/science/article/pii/S1342937X15000076"
              target="_blank"
              rel="noreferrer"
            >
              A tectonic model reconciling evidence for the collisions between India, Eurasia and intra-oceanic
              arcs of the central-eastern Tethys
            </a>, Gondwana Research, 28, 451-492.
          </li>
        </ul>
      </div>
      <SiteFooter />
    </main>
  );
}
