'use client';

import { useEffect, useState } from 'react';

export function SiteFooter() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
      setIsVisible(nearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={`legacy-footer ${isVisible ? 'footer-visible' : 'footer-hidden'}`}>
      <div className="container legacy-footer-inner">
        <span className="copyright-long">Copyright &copy; 2015-2022 The University of Sydney. All rights reserved.</span>
        <a href="http://sydney.edu.au/disclaimer.html">Disclaimer</a>
        <a href="http://sydney.edu.au/privacy-policy.html">Privacy</a>
      </div>
    </footer>
  );
}