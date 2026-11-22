import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The portal's images are plain static files, many of them legacy
      // screenshots without known sizes. next/image would need a width and
      // height for each one and an image optimizer at runtime, for little gain.
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'public/**', 'next-env.d.ts'],
  },
];

export default config;
