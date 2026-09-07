'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/agegrid-1-800x470.png', alt: 'Present-day Age Grid #1' },
  { src: '/img/agegrid-2-800x470.png', alt: 'Present-day Age Grid #2' },
  { src: '/img/agegrid-3-800x470.png', alt: 'Present-day Age Grid #3' },
];

export default function PresentDayAgegridPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Present-day Seafloor-Spreading Age Grid of The Ocean Floor</h1>

        <ScreenshotCarousel images={screenshotImages} label="Present-day Age Grid screenshots" />

        <p>
          We present an updated oceanic crustal age grid and a set of complementary grids including spreading rate,
          asymmetry, direction and obliquity. Our dataset is based on a selected set of magnetic anomaly
          identifications and the plate tectonic model of Müller et al. (2019). We find the mean age of oceanic
          crust is 64.2 Myrs, slightly older than previous estimates, mainly due to the inclusion of pockets of
          Mesozoic aged crust in the Atlantic and Mediterranean and improvements to the Jurassic Pacific triangle.
          This older crust is partly compensated by additional Cenozoic-aged back-arc basin crust not included in
          previous models. The distribution of spreading modes based on area of preserved crust is relatively equal
          between slow (20–55 mm/yr) and fast (75–180 mm/yr) spreading systems at 33 and 39%, respectively. Crust
          transitional between fast and slow, or intermediate systems (55–75 mm/yr), cover 20% of the preserved
          ocean floor with much smaller proportions of crust formed at ultra-slow (5%) and super-fast (3%) spreading
          systems. Slow and intermediate spreading systems exhibit the most stable behavior in terms of spreading
          asymmetry and obliquity, with the widest distribution of obliquities occurring at ultra-slow spreading
          systems, consistent with present-day observations. Our confidence grid provides a complementary resource
          for non-experts to identify those parts of the age grid that are least well constrained. Our grids in 6, 2
          and 1 arc-minute resolution as well as our python workflow, isopolate, used to compute our datasets are
          freely available in online repositories and on the GPlates data portal.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=AgeGridP" target="_blank" rel="noreferrer">
            View The Present-day Agegrid Map in 3D Globe
          </a>
        </p>
        <p style={{ textAlign: 'center' }}>
          <a
            className="legacy-info-btn"
            href="https://www.earthbyte.org/a-global-dataset-of-present-day-oceanic-crustal-age-and-seafloor-spreading-parameters/"
            target="_blank"
            rel="noreferrer"
          >
            More Information About The Present-day Age Grid
          </a>
        </p>

        <h2>Timescales</h2>
        <p>
          <strong>GEEK2007:</strong>
        </p>
        <p>
          Gee J, Kent D. 2007.{' '}
          <a href="https://academiccommons.columbia.edu/doi/10.7916/D8DV1V8P" target="_blank" rel="noreferrer">
            Source of oceanic magnetic anomalies and the geomagnetic polarity timescale
          </a>. In Treatise on Geophysics, Vol. 5: Geomagnetism, ed. M Kono, pp. 455–507. Amsterdam: Elsevier. 1st
          ed. (ages of 0-83.5Ma)
        </p>
        <p>
          Channell JET. 1995.{' '}
          <a href="https://agupubs.onlinelibrary.wiley.com/doi/abs/10.1029/95RG00404" target="_blank" rel="noreferrer">
            Recalibration of the geomagnetic polarity timescale
          </a>. Rev. Geophys. 33:161–68 (ages 83.5 Ma and older)
        </p>
        <p>
          <strong>GTS2012:</strong>
        </p>
        <p>
          Gradstein, F. M., Ogg, J. G., Schmitz, M., &amp; Ogg, G. (2012).{' '}
          <a
            href="https://www.elsevier.com/books/the-geologic-time-scale-2012/gradstein/978-0-444-59425-9"
            target="_blank"
            rel="noreferrer"
          >
            The geologic time scale 2012
          </a>. Amsterdam: Elsevier.
        </p>

        <HowToUseCesium />

        <h2>References</h2>
        <ul>
          <li>
            Seton M., Müller, R. D., Zahirovic, S., Williams, S., Wright, N., Cannon, J., Whittaker, J., Matthews,
            K., McGirr, R., 2020,{' '}
            <a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2020GC009214" target="_blank" rel="noreferrer">
              A global dataset of present-day oceanic crustal age and seafloor spreading parameters
            </a>, doi: 10.1029/2020GC009214
          </li>
        </ul>
        <p>
          You can download the age grid files from{' '}
          <a href="https://www.earthbyte.org/webdav/ftp/earthbyte/agegrid/2020/Grids/" target="_blank" rel="noreferrer">
            https://www.earthbyte.org/webdav/ftp/earthbyte/agegrid/2020/Grids/
          </a>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
