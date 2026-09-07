'use client';

import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

const screenshotImages = [
  { src: '/img/mapmaker-1-800x470.png', alt: 'Paleomap Maker #1' },
  { src: '/img/mapmaker-2-800x470.png', alt: 'Paleomap Maker #2' },
  { src: '/img/mapmaker-3-800x470.png', alt: 'Paleomap Maker #3' },
];

export default function PaleomapMakerPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>EarthByte Paleomap Maker</h1>

        <ScreenshotCarousel images={screenshotImages} label="Paleomap Maker screenshots" />

        <p>
          EarthByte Paleomap Maker is a web service launched by{' '}
          <a href="http://www.earthbyte.org/contacts.html" target="_blank" rel="noreferrer">EarthByte group</a> in{' '}
          <a href="http://www.geosci.usyd.edu.au/index.shtml" target="_blank" rel="noreferrer">
            the Geosciences School
          </a>{' '}
          of <a href="http://sydney.edu.au/" target="_blank" rel="noreferrer">the University of Sydney</a>,
          designed to provide researchers with plate-tectonic data reconstruction and visualization services. The
          core reconstruction engine is powered by the cutting-edge open-source plate-tectonic reconstruction
          software, <a href="http://www.gplates.org" target="_blank" rel="noreferrer">GPlates</a>. The
          visualization is made available by using{' '}
          <a href="https://scitools.org.uk/cartopy/docs/latest/" target="_blank" rel="noreferrer">Cartopy.</a> The
          EarthByte group have prepared a range of{' '}
          <a href="https://www.earthbyte.org/gplates-2-2-software-and-data-sets/" target="_blank" rel="noreferrer">
            sample datasets
          </a>{' '}
          and models that allows user to quickly and easily get up-and-running with plate tectonic reconstructions.
        </p>
        <p>
          Users are able to choose datasets that they want to plot, and set a geological time and map projection.
          After hitting the &quot;Create Map&quot; button, the map will be presented in the web browser in a few
          seconds. User&apos;s configurations can be kept in their workspaces. So, next time when they login again,
          they can continue working on the map that they had left behind last time. The power users are allowed to
          upload their datasets and reconstruction models to create their own maps.
        </p>
        <p>
          The Paleomap Maker is intended to help researchers who have little computer knowledge to plot their maps
          with modern computer techniques. The Paleomap Maker also serves as a platform for scientific data sharing
          and publishing. In the near future, the Paleomap Maker will provide reconstruction service which allows
          users to reconstruct their data online.
        </p>

        <p>Getting Started: It is very easy to get started.</p>
        <ul>
          <li>Click <a href="/map" target="_blank" rel="noreferrer">here</a> to access the Paleomap Maker web application.</li>
          <li>Sign up for an account (a default workspace will be created for the new user.)</li>
          <li>Hit the &quot;Create Map&quot; button to plot map.</li>
          <li>Play around with the clickable things in web browser (very straightforward)</li>
        </ul>
        <p>
          Need help? Click <a href="/static/map_maker_manual.pdf" target="_blank" rel="noreferrer">here</a>.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/map/" target="_blank" rel="noreferrer">
            Launch PaleoMap Maker
          </a>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
