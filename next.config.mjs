/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Temporary: the dynamic topography globe images still come from the old
      // portal, which sends no CORS header. Serving them through this origin
      // lets Cesium use them as textures. Remove once the JPEGs are on the data
      // server (NEXT_PUBLIC_DT_RASTER_SOURCE=tiles) -- see
      // src/lib/dynamicTopography/service.ts.
      {
        // no trailing slash: Next redirects those away before rewrites run
        source: '/legacy-portal/get_dynamic_topography_raster',
        destination: 'https://portal.gplates.org/get_dynamic_topography_raster/',
      },
    ];
  },
};

export default nextConfig;
