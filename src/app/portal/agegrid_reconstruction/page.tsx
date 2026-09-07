'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/agegrid-recon-1-800x470.png', alt: 'Age grid reconstruction #1' },
  { src: '/img/agegrid-recon-2-800x470.png', alt: 'Age grid reconstruction #2' },
  { src: '/img/agegrid-recon-3-800x470.png', alt: 'Age grid reconstruction #3' },
];

export default function AgegridReconstructionPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Reconstruction of Seafloor-Spreading Age Grid of The Ocean Floor</h1>

        <ScreenshotCarousel images={screenshotImages} label="Age Grid Reconstruction screenshots" />

        <p>
          Conventional models of global plate motions once took the form of reconstructed map snapshots through
          time, often without an accompanying digital rotation model describing the motions of the plates and
          without present-day digital plate polygons that clarify which features on Earth&apos;s surface moved
          according to which plate. Most importantly, these models lacked a sense of the time-dependence of plate
          boundary configurations, prompting the development of a new generation of global plate motion models that
          reflect the dynamic nature of the plates themselves through a set of continuously closing plate polygons.
          These new topological plate motion models play a key role in enabling the computation of plate velocities
          for the entire surface of the globe through time, for evaluating the time-dependence of the distribution
          of plate sizes, and for linking alternative plate kinematic models to global geodynamic models. Equally
          critical is their usefulness in the computation of plate boundary lengths through time to investigate
          crustal production along mid-ocean ridges.
        </p>
        <p>
          The ability of the geology and geophysics community to generate the next generation of plate
          reconstructions has been dramatically improved by the open-source GPlates software and its associated
          Geological Information Model. <a href="https://www.gplates.org" target="_blank" rel="noreferrer">GPlates</a>{' '}
          enables the construction of global plate hierarchies and rotation files and allows the testing of
          alternative plate motion models. It includes the functionality to construct continuously closing plate
          polygons, representing a global network of moving plate boundaries that can be closed on the fly to form
          a complete global network of interlocking plate polygons.
        </p>
        <p>
          The first global plate model with continuously closing plate boundaries was published by Gurnis and
          covered most of the Cretaceous and Cenozoic periods (140 Ma to the present). It formed the basis for
          several studies, including a comparison of five alternative global absolute plate motion models in terms
          of their predicted subduction and mantle convection history, an analysis of global net rotation of the
          plates through time, and modeling of lower mantle structure. This was superseded by the global plate model
          of Seton, which covers the entire time period from the breakup of Pangea to the present and contains a
          range of regional improvements over the previous models. Recently, this model was used to generate a
          detailed analysis of global plate velocities and plate events since 200 Ma. Another distinguishing aspect
          of this new generation of plate models is that they include complete reconstructions of the age-area
          distribution of the ocean floor. This in turn facilitates an exploration of the connection between
          tectonic events and fluctuations in ocean chemistry as well as global climate events through time.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/?view=AgeGrid" target="_blank" rel="noreferrer">
            View Agegrid Reconstruction Map in 3D Globe
          </a>
        </p>
        <p style={{ textAlign: 'center' }}>
          <a
            className="legacy-info-btn"
            href="https://www.earthbyte.org/muller-et-al-2019-deforming-plate-reconstruction-and-seafloor-age-grids-tectonics/"
            target="_blank"
            rel="noreferrer"
          >
            More Information About The Age Grid Reconstruction
          </a>
        </p>

        <HowToUseCesium />

        <h2>References</h2>
        <ul>
          <li>
            Müller, R. D., Zahirovic, S., Williams, S. E., Cannon, J., Seton, M., Bower, D. J., Tetley, M. G.,
            Heine, C., Le Breton, E., Liu, S., Russell, S. H. J., Yang, T., Leonard, J., and Gurnis, M. (2019),{' '}
            <a
              href="https://www.earthbyte.org/muller-et-al-2019-deforming-plate-reconstruction-and-seafloor-age-grids-tectonics/"
              target="_blank"
              rel="noreferrer"
            >
              A global plate model including lithospheric deformation along major rifts and orogens since the
              Triassic.
            </a>{' '}
            Tectonics, vol. 38, https://doi.org/10.1029/2018TC005462.
          </li>
        </ul>

        <p>
          <strong>Note about the evolution of the western Tethys in this model:</strong> The Western Tethys, north
          of Arabia, is punctuated by ophiolite formation and obduction in Cretaceous times. The first end-member
          involves applying the central and eastern Tethys analogues of back-arc opening and closure following
          ophiolite obduction, much like is usually implied in the Kohistan-Ladakh and Greater India collision zone.
          This scenario makes the Western Tethys north of Arabia consistent with the model of the eastern Tethys.
          However, a second end-member interpretation for the formation of many of the ophiolites in the region is
          that they develop when a mid-oceanic ridge inverts to become a subduction zone. Both options are
          plausible, but we implemented a change in this plate model after it was published to reflect the first
          end-member scenario in order to link the region to the eastern Tethys in a plausible way. This scenario is
          based on back-arc opening from ~125 Ma (Jolivet et al., 2016), with subduction of back-arc initiating in
          Albian times from ~110 Ma (Ghazi et at., 2003; Aygul et al., 2015). Obduction and Arabia collision with an
          arc occurs at 85 Ma (Jolivet et al., 2016; Jagoutz et al., 2016). The scenario is also consistent with the
          recent work of Morris et al. (2016) on the Oman Ophiolite.
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
