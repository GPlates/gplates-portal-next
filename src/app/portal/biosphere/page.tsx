'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/biosphere-1-800x470.png', alt: 'Biosphere screenshot #1' },
  { src: '/img/biosphere-2-800x470.png', alt: 'Biosphere screenshot #2' },
  { src: '/img/biosphere-3-800x470.png', alt: 'Biosphere screenshot #3' },
  { src: '/img/biosphere-4-800x470.png', alt: 'Biosphere screenshot #4' },
  { src: '/img/biosphere-5-800x470.png', alt: 'Biosphere screenshot #5' },
];

export default function BiospherePage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Deep Biosphere</h1>

        <ScreenshotCarousel images={screenshotImages} label="Deep Biosphere screenshots" />

        <p>
          The &quot;Deep Biosphere&quot; Cesium globe presents an insight into the extreme conditions that life has
          adapted to on Earth. Based on the{' '}
          <a href="https://deepcarbon.net/feature/how-hot-is-too-hot" target="_blank" rel="noreferrer">
            findings of researchers from the Deep Carbon Observatory
          </a>, the temperature limit for life has been demonstrated to be ~120°C. Based on this, and combined with
          Earth&apos;s topography (ETOPO1; Amante et al. 2009) and expected geotherms in continental and oceanic
          crust (Hamza et al., 2008), Robert Pockalny has developed iso-surfaces that represent this descent in
          depth towards the limit of biological processes. The globe is also superimposed with a database
          (including many sites from Magnabosco et al., 2018) of points (black circles on continents, and white
          triangles over oceanic crust) of sample locations that document the biological material that was
          collected.
        </p>

        <p>
          Follow these links for more information about the &quot;Deep Biosphere&quot;:
          <br />
          <a href="https://deepcarbon.net/life-deep-earth-totals-15-23-billion-tonnes-carbon" target="_blank" rel="noreferrer">
            https://deepcarbon.net/life-deep-earth-totals-15-23-billion-tonnes-carbon
          </a>
          <br />
          <a href="https://en.wikipedia.org/wiki/Deep_biosphere" target="_blank" rel="noreferrer">
            https://en.wikipedia.org/wiki/Deep_biosphere
          </a>
        </p>

        <p>
          <strong>Contributors:</strong>
          <br />
          <strong>Robert Pockalny</strong> (Uni of Rhode Island), <strong>Sabin Zahirovic</strong> (Uni of Sydney),{' '}
          <strong>Michael Chin a.k.a Xiaodong Qin</strong> (Uni of Sydney), <strong>Rick Colwell</strong> (Oregon
          State University), <strong>Darlene Trew Crist</strong> (DCO), <strong>Katie Pratt</strong> (DCO),{' '}
          <strong>Josh Wood</strong> (DCO)
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=Biosphere" target="_blank" rel="noreferrer">
            View Biosphere Map on 3D Globe
          </a>
        </p>

        <HowToUseCesium />

        <h2>Reference</h2>
        <ul>
          <li>
            Amante, C., Eakins, B., and Boulder, C., 2009,{' '}
            <a href="https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO1/docs/ETOPO1.pdf" target="_blank" rel="noreferrer">
              &quot;ETOPO1 1 arc-minute global relief model: Procedures, data sources and analysis.&quot;
            </a>{' '}
            NOAA Technical Memorandum.
          </li>
          <li>
            Hamza, V. M., R. R. Cardoso, and CF Ponte Neto.{' '}
            <a href="https://link.springer.com/article/10.1007/s00531-007-0254-3" target="_blank" rel="noreferrer">
              &quot;Spherical harmonic analysis of earth&apos;s conductive heat flow.&quot;
            </a>{' '}
            International Journal of Earth Sciences 97.2 (2008): 205-226.
          </li>
          <li>
            Heberling, Cara, et al.{' '}
            <a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2009GC002968" target="_blank" rel="noreferrer">
              &quot;Extent of the microbial biosphere in the oceanic crust.&quot;
            </a>{' '}
            Geochemistry, Geophysics, Geosystems 11.8 (2010).
          </li>
          <li>
            HYCOM Global Ocean Model. Retrieved from{' '}
            <a href="https://www.hycom.org/dataserver" target="_blank" rel="noreferrer">
              https://www.hycom.org/dataserver
            </a>{' '}
            July, 2018.
          </li>
          <li>
            LaRowe, Douglas E., et al.{' '}
            <a
              href="https://pubs.geoscienceworld.org/gsa/geology/article/45/3/275/195318/Temperature-and-volume-of-global-marine-sediments"
              target="_blank"
              rel="noreferrer"
            >
              &quot;Temperature and volume of global marine sediments.&quot;
            </a>{' '}
            Geology 45.3 (2017): 275-278.
          </li>
          <li>
            Laske, G., et al.{' '}
            <a href="https://ui.adsabs.harvard.edu/abs/2012EGUGA..14.3743L/abstract" target="_blank" rel="noreferrer">
              &quot;CRUST1.0: An updated global model of Earth&apos;s crust.&quot;
            </a>{' '}
            Geophys Res Abs 14 (2012): 3743.
          </li>
          <li>
            Magnabosco, C., et al.{' '}
            <a href="https://www.nature.com/articles/s41561-018-0221-6" target="_blank" rel="noreferrer">
              &quot;The biomass and biodiversity of the continental subsurface.&quot;
            </a>{' '}
            Nature Geoscience 11.10 (2018): 707-717.
          </li>
          <li>
            Willmott, Cort J., and Kenji Matsuura.{' '}
            <a
              href="http://climate.geog.udel.edu/~climate/html_pages/README.ghcn_ts2.html"
              target="_blank"
              rel="noreferrer"
            >
              &quot;Terrestrial air temperature and precipitation: Monthly and annual time series (1950–1999) Version
              1.02.&quot;
            </a>{' '}
            Center for Climatic Research, University of Delaware, Newark (2001).
          </li>
        </ul>
      </div>
      <SiteFooter />
    </main>
  );
}
