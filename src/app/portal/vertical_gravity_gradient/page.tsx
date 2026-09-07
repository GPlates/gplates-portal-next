'use client';

import { HowToUseCesium } from '../../../components/HowToUseCesium';
import { ScreenshotCarousel } from '../../../components/ScreenshotCarousel';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';
import './page.css';

const screenshotImages = [
  { src: '/img/vgg-1-800x470.png', alt: 'VGG #1' },
  { src: '/img/vgg-2-800x470.png', alt: 'VGG #2' },
];

const exampleScreenshots = [
  {
    full: '/img/Indian_Ocean_view_westward_from_Australia.jpg',
    thumb: '/img/Indian_Ocean_view_westward_from_Australia_thumbnail.jpg',
    alt: 'Indian_Ocean_view_westward_from_Australia.jpg',
    caption: 'Westward Indian Ocean View from Australia',
  },
  {
    full: '/img/Indian_Ocean_Wharton_Basin_view_north.jpg',
    thumb: '/img/Indian_Ocean_Wharton_Basin_view_north_thumbnail.jpg',
    alt: 'Indian_Ocean_Wharton_Basin_view_north.jpg',
    caption: 'Northward Wharton Basin/Perth Abyssal Plain View',
  },
  {
    full: '/img/Marianas_Trench_and_PhilippineSea_southward_view_towards_Australia.jpg',
    thumb: '/img/Marianas_Trench_and_PhilippineSea_southward_view_towards_Australia_thumbnail.jpg',
    alt: 'Marianas_Trench_and_PhilippineSea_southward_view_towards_Australia_thumbnail.jpg',
    caption: 'Southward View of the Mariana Trench and Philippine Sea towards Australia',
  },
  {
    full: '/img/SE_Indian_Ocean_west_view.jpg',
    thumb: '/img/SE_Indian_Ocean_west_view_thumbnail.jpg',
    alt: 'SE_Indian_Ocean_west_view.jpg',
    caption: 'Westward view of the Southeast Indian Ocean',
  },
  {
    full: '/img/SW_Indian_Ridge_view_west.jpg',
    thumb: '/img/SW_Indian_Ridge_view_west_thumbnail.jpg',
    alt: 'SW_Indian_Ridge_view_west.jpg',
    caption: 'Westward view of the Southwest Indian Ridge',
  },
  {
    full: '/img/Tasman_Sea_Lord_Howe_Rise_view_south.jpg',
    thumb: '/img/Tasman_Sea_Lord_Howe_Rise_view_south_thumbnail.jpg',
    alt: 'Tasman_Sea_Lord_Howe_Rise_view_south.jpg',
    caption: 'Southward view of the Tasman Sea and Lord Howe Rise',
  },
];

export default function VerticalGravityGradientPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Vertical Gravity Gradient (Version 23.1)</h1>

        <ScreenshotCarousel images={screenshotImages} label="Vertical Gravity Gradient screenshots" />

        <p>
          Our knowledge of the seafloor in large areas of inaccessible ocean come from maps of the Earth&apos;s
          gravity field derived using satellite altimetry. A new version of the global vertical gravity gradient
          (VGG) map, recently published in the journal &apos;Science&apos;, shows unprecedented detail, helping us
          map never-before-seen features in many regions. Use the link below to explore these data yourself within
          your web browser using an interactive 3D visualisation.
        </p>

        <p style={{ textAlign: 'center' }}>
          <a className="legacy-success-btn" href="/cesium/" target="_blank" rel="noreferrer">
            View VGG in 3D
          </a>
        </p>

        <p>
          To learn more about these data, visit David Sandwell&apos;s website on{' '}
          <a href="http://topex.ucsd.edu/grav_outreach/" target="_blank" rel="noreferrer">
            Exploring Ocean Tectonics from Space
          </a>
        </p>

        <HowToUseCesium />

        <h2>Reference</h2>
        <ul>
          <li>
            David T. Sandwell, R. Dietmar Müller, Walter H. F. Smith, Emmanuel Garcia, Richard Francis,{' '}
            <a href="http://www.sciencemag.org/content/346/6205/65" target="_blank" rel="noreferrer">
              New global marine gravity model from CryoSat-2 and Jason-1 reveals buried tectonic structure
            </a>, Science, Vol. 346, no. 6205, pp. 65-67, doi: 10.1126/science.1258213, 2014.
            <br />
            <br />
            <a href="http://topex.ucsd.edu/grav_outreach/#links_auth" target="_blank" rel="noreferrer">
              Author information and acknowledgments
            </a>
          </li>
        </ul>

        <h2>Example Screenshots</h2>
        {exampleScreenshots.map((shot, index) => (
          <div key={shot.full}>
            <div className="example-screenshot-row">
              <a href={shot.full} target="_blank" rel="noreferrer">
                <img src={shot.thumb} alt={shot.alt} />
              </a>
              <h3 className="example-screenshot-caption">{shot.caption}</h3>
            </div>
            {index < exampleScreenshots.length - 1 && <hr />}
          </div>
        ))}
      </div>
      <SiteFooter />
    </main>
  );
}
