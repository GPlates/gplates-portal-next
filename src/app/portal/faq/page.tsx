'use client';

import { useEffect, useState } from 'react';
import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';
import './page.css';

type FaqItem = {
  question: string;
  answer: string;
  items?: string[];
};

const fallbackFaqItems: FaqItem[] = [
  {
    question: 'What web browsers can be used to access the web applications in GPlates Portal?',
    answer: 'The 3D data visualisation needs WebGL support from your web browser. Chrome is recommended; Firefox, Internet Explorer 11, Opera, and Safari also support WebGL.',
  },
  {
    question: 'How to enable WebGL in Safari?',
    answer: 'Open Safari Preferences, select Advanced, enable the Develop menu in the menu bar, then choose Enable WebGL from the Develop menu.',
  },
  {
    question: 'How to control the 3D globe?',
    answer: 'Use the time slider to navigate reconstruction time. Drag with the left mouse button to rotate or pan, drag with the right mouse button or use the middle wheel to zoom, and middle-click and drag to rotate around a point on the globe.',
    items: ['On a laptop trackpad without a mouse, hold the Control key to emulate the middle mouse button.'],
  },
];

function getFaqEndpoint() {
  const apiBase = process.env.NEXT_PUBLIC_GWS_API_BASE?.replace(/\/$/, '');
  return apiBase ? `${apiBase}/portal/faq` : null;
}

export default function FaqPage() {
  const [faqItems, setFaqItems] = useState(fallbackFaqItems);

  useEffect(() => {
    const endpoint = getFaqEndpoint();
    if (!endpoint) return;

    const controller = new AbortController();

    async function loadFaq(url: string) {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) return;

        const payload: unknown = await response.json();
        if (Array.isArray(payload) && payload.every(isFaqItem)) {
          setFaqItems(payload);
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.warn('Unable to load FAQ content from GPlates Web Service.', error);
        }
      }
    }

    void loadFaq(endpoint);
    return () => controller.abort();
  }, []);

  return (
    <main className="portal-page faq-page">
      <SiteHeader />
      <div className="container portal-content">
        <h1>Frequently Asked Questions</h1>
        {faqItems.map((item) => (
          <section key={item.question} className="faq-item">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
            {item.items && (
              <ul>
                {item.items.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            )}
          </section>
        ))}
        <p className="faq-links">
          <a href="http://get.webgl.org/" target="_blank" rel="noreferrer">Check WebGL support</a>
          {' or '}
          <a href="http://www.webglreport.com" target="_blank" rel="noreferrer">view a detailed WebGL report</a>.
        </p>
        <h2><a href="https://www.earthbyte.org/contact-us-3/">Contact us</a> for further assistance.</h2>
      </div>
      <SiteFooter />
    </main>
  );
}

function isFaqItem(value: unknown): value is FaqItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.question === 'string'
    && typeof item.answer === 'string'
    && (item.items === undefined || (Array.isArray(item.items) && item.items.every((detail) => typeof detail === 'string')));
}