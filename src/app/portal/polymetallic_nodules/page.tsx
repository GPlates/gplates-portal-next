'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/polymetallic_nodules-800x470-1.png', alt: 'Polymetallic Nodules #1' },
  { src: '/img/polymetallic_nodules-800x470-2.png', alt: 'Polymetallic Nodules #2' },
];

export default function PolymetallicNodulesPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Polymetallic Nodules</h1>

        <ScreenshotCarousel images={screenshotImages} label="Polymetallic Nodules screenshots" />

        <p>
          Polymetallic nodules found on the abyssal plains of the oceans represent one of the slowest known
          geological processes, and are a source of critical and rare metals for frontier technologies. A
          quantitative assessment of their occurrence world-wide has been hampered by a research focus on the
          north-east Pacific Ocean, and the lack of a global open-access dataset of nodules. We have compiled a
          global dataset of over 10,000 seabed nodule and control samples, and combine it with digital grids of key
          environmental parameters to generate a predictive machine learning model of nodule occurrence. In order of
          decreasing parameter ranking, we find that nodules are associated with very low sedimentation rates
          (&lt; 0.5 cm/ky), moderately high oxygen values (150 and 210 mmol/m3), lithologies of clay followed by
          calcareous ooze, low summer surface productivity (&lt; 300 mgC/m2/day), low benthic biomass concentration
          (&lt; 1 log mgC/m2), water depths &gt; 4500 m, and low total organic carbon content (0.3–0.5 wt%).
          Competing hypotheses for nodule sustention and thus continued growth on the seafloor are the removal of
          sediment by bottom water currents and biological activity. Using a high-resolution eddy-resolving ocean
          circulation model we find that the bottom current speeds over nodule fields are too low (&lt; 5 cm/s) to
          remove sediment, implicating the activity of epibenthic megafauna as the most likely mechanism. Our global
          nodule probability map combined with the assessment of a range of environmental drivers provides an
          improved basis for decision and policy making in the controversial area of deep-sea exploration.
        </p>
        <p>
          Note that medium grey regions reflect missing data in one or more of the environmental grids used in the
          analysis.
        </p>
        <p>
          The data that support the findings of this study are available from{' '}
          <a href="https://github.com/EarthByte/nodules" target="_blank" rel="noreferrer">
            https://github.com/EarthByte/nodules
          </a>, together with the workflow in the form of a Jupyter Notebook.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=Polymetallic_Nodules" target="_blank" rel="noreferrer">
            View Polymetallic Nodules Map on 3D Globe
          </a>
        </p>

        <HowToUseCesium />

        <h2>Reference</h2>
        <ul>
          <li>
            Dutkiewicz, A., Judge, A., Müller R.D., 2020,{' '}
            <a
              href="https://www.researchgate.net/publication/338445158_Environmental_predictors_of_deep-sea_polymetallic_nodule_occurrence_in_the_global_ocean"
              target="_blank"
              rel="noreferrer"
            >
              Environmental predictors of deep-sea polymetallic nodule occurrence in the global ocean,
            </a>{' '}
            Geology. doi:10.1130/G46836.1 The supplementary information is available{' '}
            <a
              href="https://www.researchgate.net/publication/338619797_Dutkiewicz_et_al_Data_Repository_nodules_Geology_2020pdf"
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
