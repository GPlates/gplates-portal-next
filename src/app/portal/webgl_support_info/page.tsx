'use client';

import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

export default function WebglSupportInfoPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1>No WebGL support is detected. The 3D rendering engine could not be initialized.</h1>

        <h2>What should I do now?</h2>
        <p>
          Download and install the latest web browser{' '}
          <a href="http://www.google.com/chrome/browser/" target="_blank" rel="noreferrer">Chrome</a> and use Chrome
          to try the page again.
        </p>

        <h2>Safari Web Browser on Mac</h2>
        <p>
          The WebGL might be disabled by default in Safari. Follow the instructions below to enable WebGL. The
          WebGL support in Safari might be experimental. The Chrome web browser is strongly recommended.
        </p>
        <ul>
          <li>Open the Safari menu and select Preferences.</li>
          <li>Click the Advanced tab in the Preferences window.</li>
          <li>Check the &quot;Show Develop menu in menu bar&quot; checkbox at the bottom of the window.</li>
          <li>Open the Develop menu in the menu bar and select Enable WebGL.</li>
        </ul>

        <h2>Mobile Phone and Tablet</h2>
        <p>It is highly recommended to use a desktop or laptop to visit the 3D pages.</p>

        <h2>More Information About WebGL Support</h2>
        <p>
          Click <a href="http://get.webgl.org/" target="_blank" rel="noreferrer">here</a> to see if this web browser
          supports WebGL. Click <a href="http://www.webglreport.com" target="_blank" rel="noreferrer">here</a> for
          the detailed WebGL support information about this web browser.
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
