'use client';

import { useEffect, useState } from 'react';

const apps = [
  { name: 'Vertical Gravity Gradient Grid', url: '/cesium/', iconUrl: '/img/vgg-icon.png', infoUrl: '/portal/vertical_gravity_gradient' },
  { name: 'Gravity Anomaly Grid Reconstruction', url: '/cesium/?view=VGG-R', iconUrl: '/img/vggr-icon.png', infoUrl: '/portal/vertical_gravity_gradient_reconstruction/' },
  { name: 'Seafloor Lithology', url: '/cesium/?view=seabed', iconUrl: '/img/seabed-icon.png', infoUrl: '/portal/seafloor/' },
  { name: 'Rodinia Reconstruction', url: '/cesium/?view=Rodinia', iconUrl: '/img/rodinia-icon.png', infoUrl: '/portal/rodinia/' },
  { name: 'EMAG2 Magnetic Anomaly Grid', url: '/cesium/?view=EMAG2_V2', iconUrl: '/img/emag2-icon.png', infoUrl: '/portal/emag2/' },
  { name: 'EMAG2 Reconstruction', url: '/cesium/?view=EMAG2', iconUrl: '/img/emag2-reconstruction-icon.png', infoUrl: '/portal/emag2_reconstruction/' },
  { name: 'SRTM15 Topography', url: '/cesium/?view=topo15', iconUrl: '/img/topo15-icon.png', infoUrl: '/portal/srtm15/' },
  { name: 'Dynamic Topography', url: '/portal/dt/', iconUrl: '/img/topography-icon.png', infoUrl: '/portal/dynamic_topography' },
  { name: 'GPlates Web Service', url: 'https://gwsdoc.gplates.org/', iconUrl: '/img/gplates-web-service-360x270.png', infoUrl: '' },
  { name: 'Magnetic Picks', url: '/cesium/?view=GSFML', iconUrl: '/img/gsfml-icon.png', infoUrl: '/portal/gsfml/' },
  { name: 'Geology', url: '/cesium/?view=Geology', iconUrl: '/img/geology-icon.png', infoUrl: '/portal/geology/' },
  { name: 'Geology Reconstruction', url: '/cesium/?view=GeologyR', iconUrl: '/img/geology-r-icon.png', infoUrl: '/portal/geology/' },
  { name: 'PyGPlates Notebooks', url: 'https://github.com/GPlates/pygplates-tutorials#readme', iconUrl: '/img/pygplates-teaching-360x270.png', infoUrl: '' },
  { name: 'Rift Velocity', url: '/cesium/?view=rift_v', iconUrl: '/img/rift_v_icon-360x270.jpg', infoUrl: '' },
  { name: 'Extinct Ridges', url: '/cesium/?view=ExRidges', iconUrl: '/img/ExRidges-360x270.png', infoUrl: '/portal/ExRidges' },
  { name: 'Age Grids', url: '/cesium/?view=AgeGrid', iconUrl: '/img/agegrid-icon.png', infoUrl: '/portal/agegrid_reconstruction' },
  { name: 'Present-day Age Grid', url: '/cesium/?view=AgeGridP', iconUrl: '/img/agegrid-p-360x270.png', infoUrl: '/portal/present_day_agegrid' },
  { name: 'Contourites', url: '/cesium/?view=contourites', iconUrl: '/img/contourites-360x270.png', infoUrl: 'https://www.earthbyte.org/controls-on-the-global-distribution-of-contourite-drifts-insights-from-an-eddy-resolving-ocean-model/' },
  { name: 'Rift Obliquity', url: '/cesium/?view=rift_ov', iconUrl: '/img/rift_ov_icon_360x270.jpg', infoUrl: '' },
  { name: 'Deep Biosphere', url: '/cesium/?view=Biosphere', iconUrl: '/img/biosphere-icon-360x270.png', infoUrl: '/portal/biosphere/' },
  { name: 'Bouguer and Isostatic Gravity Anomalies', url: '/cesium/?view=WGM2012', iconUrl: '/img/WGM2012-icon-360x270.png', infoUrl: 'https://www.earthbyte.org/world-gravity-map/' },
  { name: 'Polymetallic Nodules', url: '/cesium/?view=Polymetallic_Nodules', iconUrl: '/img/nodules-icon-360x270.png', infoUrl: '/portal/polymetallic_nodules/' },
  { name: 'Abyssal Hills', url: '/cesium/?view=abyssal_hills', iconUrl: '/img/abyssal-hill-icon-360x270.png', infoUrl: 'https://www.earthbyte.org/identifying-characteristic-and-anomalous-mantle-from-the-complex-relationship-between-abyssal-hill-roughness-and-spreading-rates/' },
  { name: 'Topography Reconstruction', url: '/cesium/?view=topo_recon', iconUrl: '/img/topo-recon-360x270.png', infoUrl: '' },
  { name: 'Global Lithological Map', url: '/cesium/?view=global_lithological_map', iconUrl: '/img/global-lithological-map-360x270.png', infoUrl: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2012GC004370' },
  { name: 'Spreading Parameters', url: '/cesium/?view=spreading_parameters', iconUrl: '/img/spread-parameters-icon-360x270.png', infoUrl: 'https://www.earthbyte.org/a-global-dataset-of-present-day-oceanic-crustal-age-and-seafloor-spreading-parameters/' },
  { name: 'PaleoDEM', url: '/cesium/?view=PaleoDEM', iconUrl: '/img/paleo-DEM-360x270.png', infoUrl: 'https://www.earthbyte.org/paleodem-resource-scotese-and-wright-2018/' },
  { name: 'Crustal And Lithospheric Thickness', url: '/cesium/?view=crustal_litho_thickness', iconUrl: '/img/crustal-thickness-360x270.png', infoUrl: 'https://www.earthbyte.org/webdav/ftp/earthbyte/gplates_portal/Afonso_etal_lithospheric_thickness_GJI2019/' },
  { name: 'Time Machine', url: 'https://deeptime.world/TimeMachine/', iconUrl: '/img/web-gplates-360x270.png', infoUrl: 'https://docs.deeptime.world/' },
  { name: 'Reconstruction Tree', url: 'https://map.gplates.org/r12ntree', iconUrl: '/img/reconstruction-tree-360x270.png', infoUrl: '' },
];

const people = [
  { name: 'Dietmar Müller', title: 'Professor of Geophysics', work: 'The University of Sydney', url: 'http://sydney.edu.au/science/people/dietmar.muller.php', photoUrl: '/img/dietmar-180x180.png' },
  { name: 'Xiaodong Qin', title: 'Web Architect & Developer', work: 'The University of Sydney', url: 'https://www.linkedin.com/in/michael-chin-38745913', photoUrl: '/img/qin-180x180.png' },
  { name: 'Simon Williams', title: 'Future Fellow', work: 'University of Tasmania', url: 'https://www.researchgate.net/profile/Simon_Williams9', photoUrl: '/img/Simon_Williams-180x180.png' },
  { name: 'Adriana Dutkiewicz', title: 'Future Fellow', work: 'The University of Sydney', url: 'http://sydney.edu.au/science/people/adriana.dutkiewicz.php', photoUrl: '/img/Adriana-180x180.jpg' },
  { name: "Simon O'Callaghan", title: 'Senior Research Engineer', work: 'Data61', url: 'https://www.linkedin.com/in/simon-o-callaghan-07587633/', photoUrl: '/img/Simon-180x180.jpg' },
  { name: 'David Sandwell', title: 'Professor of Geophysics', work: 'Scripps Institution of Oceanography', url: 'http://topex.ucsd.edu/sandwell/', photoUrl: '/img/sandwell-180x180.jpg' },
  { name: 'Stefan Maus', title: 'Senior Scientist, Geomagnetism', work: '(CIRES) University of Colorado', url: 'http://geomag.org/info/smaus.html', photoUrl: '/img/stefan-180x180.jpg' },
  { name: 'Zheng-Xiang Li', title: 'Professor and ARC Laureate Fellow', work: 'Curtin University', url: 'https://research.curtin.edu.au/supervisor/prof-zheng-xiang-li/', photoUrl: '/img/Z-Li-180x180.png' },
  { name: 'Nicolas Flament', title: 'Associate Professor', work: 'University of Wollongong', url: 'https://scholars.uow.edu.au/display/nicolas_flament', photoUrl: '/img/Nicolas-180x180.jpg' },
  { name: 'Michael Gurnis', title: 'John E. and Hazel S. Smits Professor of Geophysics', work: 'California Institute of Technology', url: 'http://web.gps.caltech.edu/~gurnis/', photoUrl: '/img/Gurnis-180x180.jpg' },
  { name: 'Maria Seton', title: 'Associate Professor', work: 'The University of Sydney', url: 'http://sydney.edu.au/science/people/maria.seton.php', photoUrl: '/img/Maria-180x180.jpg' },
  { name: 'Joanne Whittaker', title: 'Associate Professor', work: 'IMAS, Univ. of Tasmania', url: 'http://www.utas.edu.au/profiles/staff/imas/joanne-whittaker', photoUrl: '/img/Jo-Whittaker-180x180.jpg' },
  { name: 'Sascha Brune', title: 'Senior Scientist and Head of the Geodynamic Modelling Section', work: 'GFZ German Research Centre for Geosciences', url: 'http://www.gfz-potsdam.de/en/section/geodynamic-modeling/staff/profil/sascha-brune/', photoUrl: '/img/Sascha_Brune_180x180.jpg' },
  { name: 'Nathaniel Butterworth', title: 'Senior Research Informatics Officer', work: 'Sydney Informatics Hub', url: 'https://www.linkedin.com/in/nathaniel-butterworth-72003877', photoUrl: '/img/nathan-180x180.jpg' },
  { name: 'Sarah MacLeod', title: '', work: '', url: 'http://www.earthbyte.org/tag/sarah-macleod/', photoUrl: '/img/SJM-180x180.jpg' },
  { name: 'Mandi Thran', title: 'Flood Forecaster', work: 'Bureau of Meteorology', url: 'https://research.unsw.edu.au/people/dr-mandi-thran', photoUrl: '/img/mandi-180x180.jpg' },
  { name: 'Christopher Scotese', title: 'Adjunct Professor', work: 'Emeritus, University of Texas', url: 'https://www.earth.northwestern.edu/our-people/affiliated-faculty/scotese-christopher.html', photoUrl: '/img/scotese-chris-180x180.jpg' },
  { name: 'Juan Carlos Afonso', title: 'A/Prof.', work: ' ITC, University of Twente', url: 'https://www.juanafonso.com/', photoUrl: '/img/Juan-Carlos-Afonso-180x180.png' },
];

const sponsors = [
  {
    name: 'AuScope',
    description:
      'was designed to put Australia at the forefront of international geoscience and geospatial research and to create geoscience applications for the next generation. Its aim was to assist in building Australia\'s wealth through improved and sustainable discovery, development and management of our minerals, energy and groundwater assets. It provides a step-change in our ability to spatially map Australia\'s location and internal deformation, in particular enhancing our ability to contribute to natural hazard prediction and management, both here and for our immediate neighbours.',
    logoUrl: '/img/AuScope-logo.png',
    url: 'http://www.auscope.org.au/'
  },
  {
    name: 'The University of Sydney',
    description:
      'is an Australian public research university in Sydney. Founded in 1850, it is Australia\'s first university and is regarded as one of its most prestigious. In 2015, it was ranked 45th in the QS World University Rankings. Additionally, Sydney graduates have been ranked the most employable in Australia and 14th most employable in the world, in the top 0.1%. Five Nobel and two Crafoord laureates have been affiliated with the university as graduates and faculty. Its campus is ranked in the top 10 of the world\'s most beautiful universities by the British Daily Telegraph and The Huffington Post, spreading across the inner-city suburbs of Camperdown and Darlington.',
    logoUrl: '/img/usyd-logo-black.png',
    url: 'http://sydney.edu.au/'
  },
  {
    name: 'EarthByte',
    description:
      'is an internationally leading eGeoscience collaboration between several Australian Universities, international centres of excellence and industry partners. One of the fundamental aims of the EarthByte Group is geodata synthesis through space and time, assimilating the wealth of disparate geological and geophysical data into a four-dimensional Earth model including tectonics, geodynamics and surface processes. The EarthByte Group is pursuing open innovation via collaborative software development, high performance and distributed computing, "Big Data" analysis and by making open access digital data collections available to the community.',
    logoUrl: '/img/EarthByte-banner.png',
    url: 'http://www.earthbyte.org/'
  },
  {
    name: 'Caltech\'s Seismological Laboratory',
    description:
      ', an arm of the Division of Geological and Planetary Sciences (GPS), was established in 1921. It has a distinguished history of leadership in science and serving the public interest. Internationally recognized for excellence in geophysical research and academics and home to outstanding facilities in seismic networks, high performance computing, and mineral physics, the Seismo Lab is an ideal place for study and research. The Lab serves as a focal point for earthquake information in Southern California and the world.',
    logoUrl: '/img/seismo_lab_logo.png',
    url: 'http://www.seismolab.caltech.edu/'
  },
  {
    name: 'Curtin University',
    description:
      'is Western Australia\'s largest university, and is proud of its practical focus on finding creative solutions to problems through the innovative application of technology. Curtin is an innovative, global university known for its high-impact research, strong industry partnerships and commitment to preparing you for jobs of the future. And Curtin is ranked in the top one per cent of universities worldwide in the highly regarded Academic Ranking of World Universities (ARWU) 2020.',
    logoUrl: '/img/curtin-uni-logo.png',
    url: 'https://www.curtin.edu.au/'
  },
];

const getAppTitleClass = (name: string) => {
  const isLong = name.length > 26;
  return isLong ? 'app-card-title app-card-title-long' : 'app-card-title';
};

export default function HomePage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const nearBottom = currentScrollY + windowHeight >= documentHeight - 10;

      if (currentScrollY <= 40) {
        setIsHeaderVisible(true);
      } else if (scrollingDown && currentScrollY > 80) {
        setIsHeaderVisible(false);
      }

      if (nearBottom) {
        setIsFooterVisible(true);
      } else if (!scrollingDown) {
        setIsFooterVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="page-shell">
      <header className={`legacy-header ${isHeaderVisible ? 'header-visible' : 'header-hidden'}`}>
        <nav className="legacy-navbar" aria-label="Main navigation">
          <div className="container legacy-nav-inner">
            <div className="brand-wrap">
              <a href="/" className="brand-link" aria-label="GPlates Portal home">
                <img src="/img/gplates-portal-banner.png" alt="GPlates Portal" />
              </a>
            </div>

            <div className="nav-menu-wrap">
              <div className="nav-menu-group">
                <div className="nav-dropdown">
                  <button type="button" className="nav-toggle">Resources</button>
                  <div className="nav-panel">
                    <a href="https://www.earthbyte.org/category/resources/">EarthByte Resources</a>
                    <a href="https://www.earthbyte.org/category/gplates/">GPlates Resources</a>
                    <a href="https://www.earthbyte.org/gplates-2-2-software-and-data-sets/">GPlates Sample Data</a>
                  </div>
                </div>

                <div className="nav-dropdown">
                  <button type="button" className="nav-toggle">Goto</button>
                  <div className="nav-panel">
                    <a href="https://www.gplates.org">www.GPlates.org</a>
                    <a href="https://www.earthbyte.org">www.EarthByte.org</a>
                    <a href="https://discourse.gplates.org">Community Forum</a>
                    <a href="#apps">Applications</a>
                    <a href="#people">People</a>
                    <a href="#sponsors-hr">Sponsors</a>
                  </div>
                </div>

                <div className="nav-dropdown">
                  <button type="button" className="nav-toggle">About Us</button>
                  <div className="nav-panel">
                    <a href="https://www.earthbyte.org/people/">Our Team</a>
                    <a href="https://www.earthbyte.org/contact-us-3/">Contact</a>
                    <a href="/portal/faq">FAQ</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-auth">
              <a href="/ac/login" className="auth-link">
                <span className="glyphicon">&#x2709;</span> Log In
              </a>
              <a href="/ac/signup" className="auth-link signup-link">
                <span className="glyphicon">&#x1F464;</span> Sign Up
              </a>
            </div>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-background" />
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <div id="gplates-icon-div">
            <img src="/img/newlogo.svg" alt="GPlates logo" width={81} height={81} />
          </div>

          <div id="info-div">
            <h2>Your Gateway to an Interactive Virtual Earth</h2>
            <p>3D Visualisation of Geophysical and Geological Data</p>
            <p>Interactive Plate Tectonic Reconstructions</p>
            <p>Interactive Surface Dynamic Topography</p>
            <p>PyGPlates Reconstruction Services</p>

            <div className="cta-row">
              <a href="#apps" className="primary-btn">
                Go To Apps &raquo;
              </a>
              <a href="https://discourse.gplates.org" target="_blank" rel="noreferrer" className="community-btn">
                Community Forum &raquo;
              </a>
              <a href="/portal/welcome" target="_blank" rel="noreferrer" className="learn-btn">
                Learn More &raquo;
              </a>
            </div>
          </div>

          <div id="social-media-bar">
            <a href="https://twitter.com/earthbytegroup" aria-label="Twitter">
              <img src="/img/twitter-128x128.png" alt="Twitter Icon" />
            </a>
            <a href="https://www.facebook.com/earthbyte" aria-label="Facebook">
              <img src="/img/facebook-128x128.png" alt="Facebook Icon" />
            </a>
            <a href="https://www.youtube.com/channel/UCa41IQEhmmuXmz9J6iMfsnA" aria-label="YouTube">
              <img src="/img/youtube-128x128.png" alt="YouTube Icon" />
            </a>
            <a href="https://www.instagram.com/explore/tags/earthbyte/top/" aria-label="Instagram">
              <img src="/img/instagram-128x128.png" alt="Instagram Icon" />
            </a>
          </div>
        </div>
      </section>

      <section id="apps" className="section-block apps-section">
        <div className="container">
          <div className="section-heading">
            <hr className="style-1" />
          </div>

          <div className="apps-grid">
            {apps.map((app) => (
              <article key={app.name} className="app-card" id={app.name.toLowerCase().replace(/\s+/g, '-') }>
                <h4
                  className={getAppTitleClass(app.name)}
                  data-full-name={app.name}
                  title={app.name}
                >
                  {app.name}
                </h4>
                <div className="thumbnail">
                  <img src={app.iconUrl} alt={`${app.name} preview`} />
                  <a href={app.url} className="thumb-overlay" aria-label={`Open ${app.name}`}>
                    Click to launch
                  </a>
                </div>
                <div className="app-info">
                  <a
                    href={app.infoUrl || undefined}
                    className={app.infoUrl ? 'details-link' : 'details-link disabled-link'}
                    onClick={(event) => {
                      if (!app.infoUrl) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Details
                  </a>
                  <a href={app.url} className="launch-btn">
                    Launch
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="people" className="section-block people-section">
        <div className="container">
          <div className="section-heading">
            <hr className="style-1" />
          </div>

          <div className="people-grid">
            {people.map((person) => (
              <article key={person.name} className="person-card">
                <a href={person.url} className="person-photo-link">
                  <img src={person.photoUrl} alt={`${person.name} portrait`} />
                </a>
                <strong className="person-title">{person.title}</strong>
                <strong className="person-name">{person.name}</strong>
                <strong className="person-work">{person.work}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block sponsors-section">
        <div className="container">
          <div className="section-heading">
            <hr id="sponsors-hr" className="style-1" />
          </div>

          <div className="sponsors-list">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="sponsor-row">
                <div className="sponsor-logo-wrap">
                  <a href={sponsor.url}>
                    <img src={sponsor.logoUrl} alt={`${sponsor.name} logo`} />
                  </a>
                </div>
                <div className="sponsor-copy">
                  <p>
                    <strong>{sponsor.name}</strong>
                    {` ${sponsor.description}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={`legacy-footer ${isFooterVisible ? 'footer-visible' : 'footer-hidden'}`}>
        <div className="container legacy-footer-inner">
          <span className="copyright-long">Copyright &copy; 2015-2022 The University of Sydney. All rights reserved.</span>
          <a href="http://sydney.edu.au/disclaimer.html">Disclaimer</a>
          <a href="http://sydney.edu.au/privacy-policy.html">Privacy</a>
        </div>
      </footer>

    </main>
  );
}
