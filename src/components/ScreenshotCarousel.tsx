'use client';

import { useEffect, useState } from 'react';

export type CarouselImage = {
  src: string;
  alt: string;
};

type ScreenshotCarouselProps = {
  images: CarouselImage[];
  autoplayMs?: number;
  label?: string;
  initialIndex?: number;
};

export function ScreenshotCarousel({ images, autoplayMs, label = 'Screenshots', initialIndex = 0 }: ScreenshotCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (!autoplayMs || images.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, autoplayMs);

    return () => window.clearInterval(timer);
  }, [autoplayMs, images.length]);

  if (images.length === 0) return null;

  const activeImage = images[activeIndex];

  return (
    <div className="screenshot-carousel" aria-label={label}>
      {images.length > 1 && (
        <div className="carousel-indicators">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={index === activeIndex ? 'active' : ''}
              aria-label={`Show ${image.alt}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
      <div className="carousel-stage">
        <img src={activeImage.src} alt={activeImage.alt} />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="carousel-control carousel-control-left"
              aria-label="Previous screenshot"
              onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
            >
              <span aria-hidden="true">&#8249;</span>
            </button>
            <button
              type="button"
              className="carousel-control carousel-control-right"
              aria-label="Next screenshot"
              onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
            >
              <span aria-hidden="true">&#8250;</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
