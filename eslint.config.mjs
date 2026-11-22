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
    // TEMPORARY: the Paleomap Maker files were ported from non-strict
    // TypeScript and still carry @ts-nocheck. Typing them is #10, which
    // removes this block.
    files: ['src/app/map/**'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'prefer-const': 'off',
      'no-var': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'public/**', 'next-env.d.ts'],
  },
];

export default config;
