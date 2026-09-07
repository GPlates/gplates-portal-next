'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/rodinia-1-800x470.png', alt: 'Rodinia #1' },
  { src: '/img/rodinia-2-800x470.png', alt: 'Rodinia #2' },
];

export default function RodiniaPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Rodinia Reconstruction</h1>

        <ScreenshotCarousel images={screenshotImages} label="Rodinia screenshots" />

        <p>
          Rodinia (from &apos;rodit&apos;, meaning &apos;to beget&apos; or &apos;to give birth&apos; in Russian) was
          a supercontinent that existed during the Neoproterozoic and was named as it was thought to have been the
          original supercontinent that present day continents formed from (McMenamin and McMenamin, 1990). Its
          amalgamation began just after 1100 Ma, with the collision of Baltica (north-east Europe) and Amazonia
          (north-east South America) along the east coast of Laurentia (North America), Australia-Antarctica, the
          Kalahari (South Africa) and the Congo (Central Africa) cratons colliding along the west, south-west and
          south margins respectively and Siberia (eastern Russia) colliding with the northern margin. Due to its
          central position in the supercontinent, Laurentia is considered the heart of Rodinia, and its breakup,
          occurring around 750 Ma, resulted in all of these continents rifting off it and reforming into Gondwana
          (from 650-520 Ma, including South America, Africa, Australia, India and Antarctica) or Laurussia (North
          America and Baltica).
        </p>
        <p>
          A number of reconstructions have been proposed over the past twenty years for modelling the breakup of
          Rodinia, and they all differ slightly in the exact timing and orientation of the continents. The model
          depicted here is from Li et al. (2008), a large, international collaborative project that was a
          contribution to IGCP 440, and is probably the most comprehensive review of global evidence for Rodinia.
          The model is based on a number of lines of evidence, including palaeomagnetism, regional geology,
          palaeobiology and plate kinematics.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=Rodinia" target="_blank" rel="noreferrer">
            View Rodinia Reconstruction in 3D
          </a>
        </p>

        <HowToUseCesium />

        <h2>References</h2>
        <ul>
          <li>
            Li, Z.X., Bogdanova, S.V., Collins, A.S., Davidson, A., De Waele, B., Ernst, R.E., Fitzsimons, I.C.W.,
            Fuck, R.A., Gladkochub, D.P., Jacobs, J., Karlstrom, K.E., Lu, S., Natapov, L.M., Pease, V., Pisarevsky,
            S.A., Thrane, K., Vernikovsky, V., 2008.{' '}
            <a href="http://www.sciencedirect.com/science/article/pii/S0301926807001635" target="_blank" rel="noreferrer">
              Assembly, configuration, and break-up history of Rodinia: a synthesis
            </a>. Precambrian Research 160, 179.210.
          </li>
          <li>
            McMenamin, M.A.S., McMenamin, D.L.S., 1990.{' '}
            <a href="http://www.amazon.com/The-Emergence-Animals-Mark-McMenamin/dp/0231066473" target="_blank" rel="noreferrer">
              The Emergence of Animals: The Cambrian Breakthrough
            </a>, p. 217.
          </li>
        </ul>
      </div>
      <SiteFooter />
    </main>
  );
}
