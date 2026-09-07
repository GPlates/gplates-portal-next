'use client';

import { useEffect, useState } from 'react';

export function SiteHeader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 40) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`legacy-header ${isVisible ? 'header-visible' : 'header-hidden'}`}>
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
                  <a href="/#apps">Applications</a>
                  <a href="/#people">People</a>
                  <a href="/#sponsors-hr">Sponsors</a>
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
  );
}