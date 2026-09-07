'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/seafloor-1-800x470.png', alt: 'Seafloor #1' },
  { src: '/img/seafloor-2-800x470.png', alt: 'Seafloor #2' },
];

export default function SeafloorPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Seafloor Lithology (Version 1.0)</h1>

        <ScreenshotCarousel images={screenshotImages} label="Seafloor Lithology screenshots" />

        <p>
          Knowing the patterns of distribution of sediments in the global ocean is critical for understanding
          biogeochemical cycles and how deep-sea deposits respond to environmental change at the sea surface. We
          present the first digital map of seafloor lithologies based on descriptions of nearly 14,500 samples from
          original cruise reports, interpolated using a support vector machine algorithm. We show that sediment
          distribution is more complex, with significant deviations from earlier hand-drawn maps, and that major
          lithologies occur in drastically different proportions globally. By coupling our digital map to
          oceanographic data sets, we find that the global occurrence of biogenic oozes is strongly linked to
          specific ranges in sea surface parameters. In particular, by using recent computations of diatom
          distributions from pigment-calibrated chlorophyll-a satellite data, we show that, contrary to a widely
          held view, diatom oozes are not a reliable proxy for surface productivity. Their global accumulation is
          instead strongly dependent on low surface temperature (0.9-5.7 °C) and salinity (33.8-34.0 PSS) and high
          concentrations of nutrients. Under these conditions, diatom oozes will accumulate on the seafloor
          regardless of surface productivity as long as there is limited competition from biogenous and detrital
          components, and diatom frustules are not significantly dissolved prior to preservation. Quantifying the
          link between the seafloor and the sea surface through the use of large digital data sets will ultimately
          lead to more robust reconstructions and predictions of climate change and its impact on the ocean
          environment.
        </p>
        <p>
          The digital data can be downloaded in netcdf format{' '}
          <a href="ftp://ftp.earthbyte.org/papers/Dutkiewicz_etal_seafloor_lithology" target="_blank" rel="noreferrer">
            here
          </a>.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=seabed" target="_blank" rel="noreferrer">
            View Seafloor Map on 3D Globe
          </a>
        </p>

        <h2>Legend</h2>
        <a href="/img/seabed_lithology_colorbar.jpg" target="_blank" rel="noreferrer">
          <img src="/img/seabed_lithology_colorbar.jpg" alt="Color Bar" style={{ maxWidth: '100%' }} />
        </a>

        <HowToUseCesium />

        <h2>Reference</h2>
        <ul>
          <li>
            Dutkiewicz, A., Müller R.D., O&apos;Callaghan, S. and Jóson, H., 2015,{' '}
            <a href="http://geology.gsapubs.org/content/43/9/795.full" target="_blank" rel="noreferrer">
              Census of seafloor sediments in the world&apos;s ocean
            </a>, Geology, 43, 795-798.
            <br />
            The supplementary information is available{' '}
            <a href="ftp://rock.geosociety.org/pub/reposit/2015/2015271.pdf" target="_blank" rel="noreferrer">
              here
            </a>.
          </li>
          <li>
            <strong>
              See the paper below for additional work on what controls the distribution of different lithologies:
            </strong>
            <br />
            Dutkiewicz, A., O&apos;Callaghan, S. and Müller, R.D., 2016,{' '}
            <a
              href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1002/2016GC006428"
              target="_blank"
              rel="noreferrer"
            >
              Controls on the distribution of deep‐sea sediments
            </a>, Geochemistry, Geophysics, Geosystems, 17(8), 3075-3098.
            <br />
            Supplementary information is available{' '}
            <a
              href="https://agupubs.onlinelibrary.wiley.com/action/downloadSupplement?doi=10.1002%2F2016GC006428&file=ggge21082-sup-0001-2016GC006428-s01.docx"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>.
          </li>
        </ul>
      </div>
      <SiteFooter />
    </main>
  );
}
