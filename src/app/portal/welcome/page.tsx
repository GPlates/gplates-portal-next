'use client';

import { useEffect, useState } from 'react';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';
import './page.css';

const introBullets = [
  'The new version of the vertical gravity gradient derived from satellite altimetry',
  'Plate tectonic reconstructions of gravity data created using GPlates',
  'Dynamic surface topography maps based on simulations of mantle convection (Industry Sponsors Only)',
];

const screenshotImages = [
  { src: '/img/vgg-1-800x470.png', alt: 'VGG #1' },
  { src: '/img/mapmaker-1-800x470.png', alt: 'mapmaker #1' },
  { src: '/img/topo15-2-800x470.png', alt: 'topo15 #2' },
  { src: '/img/rodinia-1-800x470.png', alt: 'Rodinia #1' },
  { src: '/img/seafloor-1-800x470.png', alt: 'Seafloor #1' },
  { src: '/img/gsfml-1-800x470.png', alt: 'gsfml #1' },
  { src: '/img/dt-1-800x470.png', alt: 'dt #1' },
];

export default function WelcomePage() {
  const [activeScreenshot, setActiveScreenshot] = useState(2);

  useEffect(() => {
    const autoplayTimer = window.setInterval(() => {
      setActiveScreenshot((currentScreenshot) => (currentScreenshot + 1) % screenshotImages.length);
    }, 5000);

    return () => window.clearInterval(autoplayTimer);
  }, []);

  return (
    <main className="welcome-page portal-page">
      <SiteHeader />

      <div className="container welcome-content">
        <section className="welcome-hero">
          <h1>Welcome to GPlates Portal</h1>
          <p>
            The GPlates Portal is a gateway to a series of web applications for the interactive visualisation
            of cutting-edge geoscience datasets, all possible within freely available web browsers. Use the
            links on the left side of this page to access visualisations of:
          </p>

          <ul className="welcome-bullets">
            {introBullets.map((item) => (
              <li key={item}>
                {item.startsWith('The new version') ? (
                  <>
                    The new version of the <strong>vertical gravity gradient</strong> derived from satellite altimetry
                  </>
                ) : item.startsWith('Plate tectonic') ? (
                  <>
                    <strong>Plate tectonic reconstructions of gravity data</strong> created using GPlates
                  </>
                ) : (
                  <>
                    <strong>Dynamic surface topography maps</strong> based on simulations of mantle convection{' '}
                    <em>(Industry Sponsors Only)</em>
                  </>
                )}
              </li>
            ))}
          </ul>

          <p>
            The 3D visualisations are powered by{' '}
            <a href="http://cesiumjs.org/index.html" target="_blank" rel="noreferrer">Cesium</a> - for general
            information on using how to use Cesium, and browser compatibility,{' '}
            <a href="/portal/faq" target="_blank" rel="noreferrer">click here</a>.
          </p>
        </section>

        <section className="welcome-section">
          <h2>About Earthbyte</h2>
          <div className="featurette">
            <div className="featurette-copy">
              <p>
                The <a href="http://www.earthbyte.org/" target="_blank" rel="noreferrer">EarthByte Group</a> in the{' '}
                <a href="http://www.geosci.usyd.edu.au/index.shtml" target="_blank" rel="noreferrer">
                  School of Geosciences
                </a>{' '}
                of <a href="http://sydney.edu.au/" target="_blank" rel="noreferrer">The University of Sydney</a>{' '}
                is one of the world&apos;s leading research groups for global and regional plate tectonic
                reconstructions and for studying the interplay between the deep earth and surface processes.
              </p>

              <p>
                The EarthByte Group leads the development of open-source plate reconstruction software --{' '}
                <a href="http://www.gplates.org" target="_blank" rel="noreferrer">GPlates</a>. GPlates enables the
                interactive manipulation of plate-tectonic reconstructions and the visualisation of geodata through
                geological time, and it facilitates interoperability of plate tectonic data and models with geodynamic
                computing services for applied and fundamental research purposes.
              </p>

              <p>
                The EarthByte Group is exploring new directions of e-research by enabling GPlates technology in the{' '}
                <a href="http://en.wikipedia.org/wiki/Cloud_computing" target="_blank" rel="noreferrer">Cloud</a>, as
                part of <a href="http://www.auscope.org.au/" target="_blank" rel="noreferrer">AuScope</a> NCRIS
                research infrastructure development and a (now concluded) project on{' '}
                <a href="http://knowledgediscovery.org" target="_blank" rel="noreferrer">
                  Big Data Knowledge Discovery for Natural Sciences
                </a>, supported by <a href="http://www.sief.org.au/" target="_blank" rel="noreferrer">SIEF</a>.
                AuScope Ltd is a non-profit company formed to facilitate the implementation of a world-class
                infrastructure system for earth science, funded by the Australian Government under the{' '}
                <a
                  href="https://education.gov.au/national-collaborative-research-infrastructure-strategy-ncris"
                  target="_blank"
                  rel="noreferrer"
                >
                  National Collaborative Research Infrastructure Strategy (NCRIS)
                </a>.
              </p>
            </div>

            <div className="featurette-image">
              <a href="/img/earthbyte_group_June2016_original.jpg" target="_blank" rel="noreferrer">
                <img src="/img/earthbyte_group_June2016.jpg" alt="EarthByte Logo" />
              </a>
            </div>
          </div>
        </section>

        <div className="welcome-callout">
          <a className="legacy-success-btn" href="/#apps" target="_self" rel="noreferrer">
            Check out the applications
          </a>
        </div>

        <section className="welcome-section">
          <h2>Screenshots</h2>
          <div className="welcome-carousel" aria-label="GPlates Portal screenshots">
            <div className="carousel-indicators">
              {screenshotImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={index === activeScreenshot ? 'active' : ''}
                  aria-label={`Show ${image.alt}`}
                  aria-pressed={index === activeScreenshot}
                  onClick={() => setActiveScreenshot(index)}
                />
              ))}
            </div>
            <div className="carousel-stage">
              <img src={screenshotImages[activeScreenshot].src} alt={screenshotImages[activeScreenshot].alt} />
              <button
                type="button"
                className="carousel-control carousel-control-left"
                aria-label="Previous screenshot"
                onClick={() => setActiveScreenshot((activeScreenshot - 1 + screenshotImages.length) % screenshotImages.length)}
              >
                <span aria-hidden="true">&#8249;</span>
              </button>
              <button
                type="button"
                className="carousel-control carousel-control-right"
                aria-label="Next screenshot"
                onClick={() => setActiveScreenshot((activeScreenshot + 1) % screenshotImages.length)}
              >
                <span aria-hidden="true">&#8250;</span>
              </button>
            </div>
          </div>
        </section>

        <section className="welcome-section">
          <h2>Reference</h2>
          <ul className="welcome-reference-list">
            <li>
              R. Dietmar Müller, Xiaodong Qin, David T. Sandwell, Adriana Dutkiewicz, Simon E. Williams, Nicolas
              Flament, Stefan Maus, Maria Seton, 2016,{' '}
              <a
                href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0150883"
                target="_blank"
                rel="noreferrer"
              >
                The GPlates Portal: Cloud-based interactive 3D visualization of global geophysical and geological
                data in a web browser
              </a>, PLoS ONE 11(3): e0150883. doi:10.1371/journal.pone.0150883
            </li>
          </ul>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
