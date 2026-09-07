'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/emag2-r-1.png', alt: 'EMAG2 Reconstruction #1' },
  { src: '/img/emag2-r-2.png', alt: 'EMAG2 Reconstruction #2' },
];

export default function Emag2ReconstructionPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Global Magnetic Anomaly Map Reconstruction</h1>

        <ScreenshotCarousel images={screenshotImages} label="EMAG2 Reconstruction screenshots" />

        <p>
          Gravity and magnetic maps are a fundamental tool for mapping the tectonic fabric of the ocean floor,
          allowing us to reconstruct many millions of years of Earth&apos;s plate tectonic evolution. We use the
          plate tectonic reconstruction software{' '}
          <a href="http://www.gplates.org" target="_blank" rel="noreferrer">GPlates</a>, combined with
          reconstruction models developed by members of the Earthbyte group, to reconstruct geophysical images and
          explore the spatio-temporal relationships between present-day seafloor morphology and plate tectonic
          processes. This{' '}
          <a
            href="https://docs.google.com/document/d/1BohvVbw0n3w8EW7asEIo72dCyRHY_aaC4BTP9Y8zSig/pub"
            target="_blank"
            rel="noreferrer"
          >
            tutorial
          </a>{' '}
          contains detailed information about how to reconstruct rasters with GPlates.
        </p>
        <p>
          Press the button below to explore EMAG2 reconstruction within your web browser using an interactive 3D
          visualisation{' '}
          <a href="http://geomag.org/models/emag2.html" target="_blank" rel="noreferrer">
            Maus et al.(2009)
          </a>.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=EMAG2" target="_blank" rel="noreferrer">
            View the Reconstruction on 3D Globe
          </a>
        </p>

        <HowToUseCesium />

        <h2>References</h2>
        <ul>
          <li>
            Seton, M., Müller, R.D., Zahirovic, S., Gaina, C., Torsvik, T.H., Shephard, G., Talsma, A., Gurnis, M.,
            Turner, M., Maus, S., Chandler, M.(2012),{' '}
            <a
              href="http://www.earthbyte.org/Resources/Pdf/Seton_etal_Global_Plate_Model_ESR2012.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Global continental and ocean basin reconstructions since 200 Ma.
            </a>{' '}
            Earth-Science Reviews, Volume 113, Issues 3-4, July 2012, Pages 212-270, ISSN 0012-8252,
            doi:10.1016/j.earscirev.2012.03.002
          </li>
          <li>
            Zahirovic, S., Seton, M. and Müller R. D. 2014.{' '}
            <a
              href="http://www.earthbyte.org/Resources/Pdf/Zahirovic_etal_2014_Cretaceous_Cenozoic_tectonic_evolution_SE_Asia.pdf"
              target="_blank"
              rel="noreferrer"
            >
              The Cretaceous and Cenozoic tectonic evolution of Southeast Asia.
            </a>{' '}
            Solid Earth, 5, 227-273. doi:10.5194/se-5-227-2014.
          </li>
          <li>
            Whittaker J.M., Williams S.E., Müller R.D., 2013.{' '}
            <a
              href="http://www.earthbyte.org/Resources/Pdf/Whittaker_etal_AusAnt_Gcubed_2013.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Revised tectonic evolution of the Eastern Indian Ocean,
            </a>{' '}
            Geochem. Geophy. Geosyst., doi:10.1002/ggge.20120
          </li>
          <li>
            Gibbons, A.D., Whittaker, J.M., Müller R.D., 2013.{' '}
            <a
              href="http://www.earthbyte.org/Resources/Pdf/Gibbons_etal_2013_TheBreakupOfEastGondwana.pdf"
              target="_blank"
              rel="noreferrer"
            >
              The breakup of East Gondwana: assimilating constraints from Cretaceous ocean basins around India into
              a best-fit tectonic model,
            </a>{' '}
            Journal of Geophysical Research, 118, 808-822, doi:10.1002/jgrb.50079
          </li>
          <li>
            Shephard, G.E., Müller R.D., and Seton, M., 2013.{' '}
            <a
              href="http://www.earthbyte.org/Resources/Pdf/Shephard_etal_2013_Arctic_plate_model_Earth-Sci_Rev.pdf"
              target="_blank"
              rel="noreferrer"
            >
              The tectonic evolution of the Arctic since Pangea breakup: Integrating constraints from surface
              geology and geophysics with mantle structure.
            </a>{' '}
            Earth-Science Reviews, Volume 124 p.148-183. doi:10.1016/j.earscirev.2013.05.012
          </li>
          <li>
            Cannon, J., Lau, E., and Müller, R. D., 2014.{' '}
            <a href="http://www.solid-earth.net/5/741/2014/" target="_blank" rel="noreferrer">
              Plate tectonic raster reconstruction in GPlates,
            </a>{' '}
            Solid Earth, 5, 741-755, doi:10.5194/se-5-741-2014.
          </li>
          <li>
            Williams, S., Müller, R.D., Landgrebe, T. C.W., Whittaker, J.M., 2012,{' '}
            <a
              href="http://www.geosociety.org/gsatoday/archive/22/4/pdf/i1052-5173-22-4-4.pdf"
              target="_blank"
              rel="noreferrer"
            >
              An open-source software environment for visualizing and refining plate tectonic reconstructions using
              high resolution geological and geophysical data sets.
            </a>{' '}
            GSA Today, 22, no. 4/5, doi: 10.1130/GSATG139A.1.
          </li>
          <li>
            Heine, C., Zoethout, J., and Müller, R. D. 2013.{' '}
            <a
              href="http://earthbyte.org/Resources/Pdf/Heine_et_al.2013.Kinematics_Sth_Atlantic.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Kinematics of the South Atlantic rift,
            </a>{' '}
            Solid Earth, 4, 215-253, 2013, doi: 10.5194/se-4-215-2013.
          </li>
        </ul>
      </div>
      <SiteFooter />
    </main>
  );
}
