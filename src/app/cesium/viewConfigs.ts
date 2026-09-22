/**
 * Ports of the RasterTerrainView-based view factories in the old portal's
 * static/js/cesium/Viewport.js (createVGGTView, createTopo15View).
 *
 * Each view is a set of selectable imagery rasters and terrains; the names are
 * the tile-pyramid directory names under raster_tiles/ and terrain_tiles/ on
 * the tile server.
 */

import { LayerColor } from '../../lib/cesium/geoJson';

export const CREDIT = 'EarthByte Group and Scripps Institution of Oceanography';

export const TERRAIN_NONE = 'None';

export type RasterCfg = {
  displayName: string;
  maxLevel: number;
  /** path under public/, or null for no colour bar */
  colorBar: string | null;
  /** where the colour bar links to, when that isn't just the bar image itself */
  colorBarLink?: string;
  /** defaults to CREDIT */
  credit?: string;
  default?: boolean;
};

export type TerrainCfg = {
  displayName: string;
  maxLevel: number;
  defaultHeightScale: number;
  heightScales: number[];
  default?: boolean;
};

/**
 * A paleo-age range, for rasters whose tiles are cut per reconstruction time
 * (the old ReconstructionView). Times are in Ma, counting back from the
 * present, so `start` is the oldest frame and `end` the youngest.
 */
export type TimeCfg = {
  start: number;
  end: number;
  step: number;
};

export type GeoJsonLayerCfg = {
  name: string;
  /** rgba 0..1; defaults to the old GeoJsonLayer.js yellow */
  color?: LayerColor;
};

export type ViewCfg = {
  title: string;
  /** the portal page or paper describing this dataset -- the old "About" button */
  aboutUrl: string;
  rasters: Record<string, RasterCfg>;
  terrains: Record<string, TerrainCfg>;
  /** present only on reconstruction views, which get a time slider */
  time?: TimeCfg;
  /** vector overlays, drawn from GeoJson/{name}/{time}.geojson.gz */
  geoJsonLayers?: GeoJsonLayerCfg[];
};

export const VIEWS = {
  'VGG-T': {
    title: 'Vertical Gravity Gradient Grid',
    aboutUrl: '/portal/vertical_gravity_gradient',
    rasters: {
      VGG_GravityVGGShading: {
        displayName: 'Gravity with VGG Shading',
        maxLevel: 6,
        colorBar: null,
      },
      VGG_Haxby: {
        displayName: 'VGG Haxby',
        maxLevel: 6,
        colorBar: '/img/haxby-vgg-color-bar.png',
        default: true,
      },
      VGG_Jet: {
        displayName: 'VGG Jet',
        maxLevel: 6,
        colorBar: '/img/jet-vgg-color-bar.png',
      },
    },
    terrains: {
      VGG: {
        displayName: 'Vertical Gravity Gradient',
        maxLevel: 7,
        defaultHeightScale: 200,
        heightScales: [100, 200, 300, 500, 800],
      },
      DNS: {
        displayName: 'Topography',
        maxLevel: 7,
        defaultHeightScale: 30,
        heightScales: [10, 20, 30, 40, 50, 100],
        default: true,
      },
    },
  },
  'VGG-R': {
    title: 'Gravity Grid Reconstructions',
    aboutUrl: '/portal/vertical_gravity_gradient_reconstruction',
    time: { start: 200, end: 0, step: 2 },
    rasters: {
      VGG: {
        displayName: 'Vertical Gravity Gradient',
        maxLevel: 3,
        colorBar: null,
        default: true,
      },
    },
    terrains: {},
    geoJsonLayers: [{ name: 'emag2_coastlines_polylines' }],
  },
  EMAG2: {
    title: 'Magnetic Anomaly Reconstruction',
    aboutUrl: '/portal/emag2_reconstruction',
    time: { start: 200, end: 0, step: 2 },
    rasters: {
      EMAG2: {
        displayName: 'EMAG2',
        maxLevel: 3,
        colorBar: null,
        credit: 'EarthByte EMAG2',
        default: true,
      },
    },
    terrains: {},
    geoJsonLayers: [{ name: 'emag2_coastlines_polylines' }],
  },
  GeologyR: {
    title: 'Geology Reconstruction',
    aboutUrl: '/portal/geology',
    time: { start: 200, end: 0, step: 2 },
    rasters: {
      'geology-r': {
        displayName: 'Geology',
        maxLevel: 3,
        colorBar: null,
        credit: 'Geology',
        default: true,
      },
    },
    terrains: {},
  },
  redblue: {
    // the old config had start/end the wrong way round (start: 0, end: 118),
    // which left its next/play controls dead; the tile pyramid runs 0..118 Ma
    title: 'Red and Blue',
    aboutUrl: '/portal/emag2_reconstruction',
    time: { start: 118, end: 0, step: 2 },
    rasters: {
      redblue: {
        displayName: 'Red and Blue',
        maxLevel: 3,
        colorBar: null,
        credit: 'EarthByte Group',
        default: true,
      },
    },
    terrains: {},
  },
  EMAG2_V2: {
    title: 'EMAG2 Magnetic Anomaly',
    aboutUrl: '/portal/emag2',
    rasters: {
      EMAG2_V2: {
        displayName: 'EMAG2 -- RedWhiteBlue',
        maxLevel: 6,
        colorBar: '/img/EMAG2_scale.png',
        credit: 'EarthByte Group, Scripps Institution of Oceanography and CIRES',
        default: true,
      },
      EMAG2_V2_NDG: {
        displayName: 'EMAG2 (No Directional Gridding) -- RedWhiteBlue',
        maxLevel: 6,
        colorBar: '/img/EMAG2_scale.png',
        credit: 'EarthByte Group, Scripps Institution of Oceanography and CIRES',
      },
      EMAG2_V2_Redblue_NDG: {
        displayName: 'EMAG2 -- RedGreenBlue',
        maxLevel: 6,
        colorBar: '/img/EMAG2_redblue.png',
        credit: 'EarthByte Group, Scripps Institution of Oceanography and CIRES',
      },
      EMAG2_V2_Redblue: {
        displayName: 'EMAG2 (No Directional Gridding) -- RedGreenBlue',
        maxLevel: 6,
        colorBar: '/img/EMAG2_redblue.png',
        credit: 'EarthByte Group, Scripps Institution of Oceanography and CIRES',
      },
    },
    terrains: {
      VGG: {
        displayName: 'Vertical Gravity Gradient',
        maxLevel: 7,
        defaultHeightScale: 200,
        heightScales: [100, 200, 300, 500, 800],
      },
      DNS: {
        displayName: 'Topography',
        maxLevel: 7,
        defaultHeightScale: 30,
        heightScales: [10, 20, 30, 40, 50, 100],
      },
      EMAG2: {
        displayName: 'EMAG2',
        maxLevel: 7,
        defaultHeightScale: 100,
        heightScales: [50, 100, 150, 250, 400],
        default: true,
      },
    },
    geoJsonLayers: [{ name: 'earthbyte_coastlines_polyline' }],
  },
  WGM2012: {
    title: 'World Gravity Map 2012',
    aboutUrl: 'https://www.earthbyte.org/world-gravity-map/',
    rasters: {
      WGM2012_Bouguer_ponc: {
        displayName: 'WGM2012_Bouguer_ponc',
        maxLevel: 6,
        colorBar: '/img/WGM_Bouguer.png',
        credit: 'EarthByte Group, BGI',
      },
      WGM2012_Isostatic_ponc: {
        displayName: 'WGM2012_Isostatic_ponc',
        maxLevel: 6,
        colorBar: '/img/WGM_Isostatic.png',
        credit: 'EarthByte Group, BGI',
        default: true,
      },
    },
    terrains: {
      VGG: {
        displayName: 'Vertical Gravity Gradient',
        maxLevel: 7,
        defaultHeightScale: 200,
        heightScales: [100, 200, 300, 500, 800],
      },
      DNS: {
        displayName: 'Topography',
        maxLevel: 7,
        defaultHeightScale: 30,
        heightScales: [10, 20, 30, 40, 50, 100],
      },
    },
    geoJsonLayers: [{ name: 'earthbyte_coastlines_polyline' }],
  },
  spreading_parameters: {
    title: 'Seafloor Spreading Parameters',
    aboutUrl: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2020GC009214',
    rasters: {
      'asym.2020.1.GeeK2007.6m': {
        displayName: 'Spreading Asymmetry',
        maxLevel: 6,
        colorBar: '/img/asym-colorbar.png',
        credit: 'EarthByte Group',
        default: true,
      },
      'dir.2020.1.GeeK2007.6m': {
        displayName: 'Spreading Direction',
        maxLevel: 6,
        colorBar: '/img/spreaddir-colorbar.png',
        credit: 'EarthByte Group',
      },
      'full_rate.2020.1.GeeK2007.6m': {
        displayName: 'Spreading Rate',
        maxLevel: 6,
        colorBar: '/img/fullrate-colorbar.png',
        credit: 'EarthByte Group',
      },
      'obliq.2020.1.GeeK2007.6m': {
        displayName: 'Spreading Obliquity',
        maxLevel: 6,
        colorBar: '/img/spreadobliq-colorbar.png',
        credit: 'EarthByte Group',
      },
      // the old config named these AgeGridGeek2007/AgeGridGTS2012, which are
      // not tile directories that exist -- these are the real ones
      age_grid_geek_2007: {
        displayName: 'Age Grid Geek2007',
        maxLevel: 6,
        colorBar: '/img/agegrid-colorbar.png',
        credit: 'EarthByte Group',
      },
      age_grid_gts_2012: {
        displayName: 'Age Grid GTS2012',
        maxLevel: 6,
        colorBar: '/img/agegrid-colorbar.png',
        credit: 'EarthByte Group',
      },
    },
    terrains: {
      VGG: {
        displayName: 'Vertical Gravity Gradient',
        maxLevel: 7,
        defaultHeightScale: 200,
        heightScales: [100, 200, 300, 500, 800],
      },
      DNS: {
        displayName: 'Topography',
        maxLevel: 7,
        defaultHeightScale: 30,
        heightScales: [10, 20, 30, 40, 50, 100],
      },
    },
  },
  crustal_litho_thickness: {
    title: 'Crustal and Lithospheric Thickness',
    aboutUrl:
      'https://www.earthbyte.org/webdav/ftp/earthbyte/gplates_portal/Afonso_etal_lithospheric_thickness_GJI2019/',
    rasters: {
      crustal_thickness: {
        displayName: 'Crustal Thickness',
        maxLevel: 5,
        colorBar: '/img/crustal-thickness-color-bar.png',
        credit: 'Afonso etal, 2019',
      },
      // the old config marked both rasters as the default; the last one won
      lithospheric_thickness: {
        displayName: 'Lithospheric Thickness',
        maxLevel: 5,
        colorBar: '/img/lithospheric-thickness-color-bar.png',
        credit: 'Afonso etal, 2019',
        default: true,
      },
    },
    terrains: {
      topo15: {
        displayName: 'SRTM15_PLUS V1',
        maxLevel: 8,
        defaultHeightScale: 30,
        heightScales: [10, 20, 30, 40, 50, 100],
        default: true,
      },
    },
    // this view drew its coastlines black rather than the default yellow
    geoJsonLayers: [{ name: 'earthbyte_coastlines_polyline', color: [0, 0, 0, 1] }],
  },
  abyssal_hills: {
    title: 'Abyssal Hills',
    aboutUrl:
      'https://www.earthbyte.org/identifying-characteristic-and-anomalous-mantle-from-the-complex-relationship-between-abyssal-hill-roughness-and-spreading-rates/',
    rasters: {
      abyssal_hill: {
        displayName: 'Abyssal Hills',
        maxLevel: 4,
        colorBar: '/img/abyssal_hill_colorbar.png',
        credit:
          'Institute for Geophysics, Jackson School of Geosciences, University of Texas at Austin',
        default: true,
      },
    },
    terrains: {
      abyssal_hill: {
        displayName: 'Abyssal Hills',
        maxLevel: 7,
        defaultHeightScale: 200,
        heightScales: [200, 400, 600, 800, 1000],
        default: true,
      },
    },
  },
  geology: {
    title: 'World Geology',
    aboutUrl: '/portal/geology',
    rasters: {
      geology: {
        displayName: 'Geology',
        maxLevel: 6,
        colorBar: '/img/click_me_to_see_legend.png',
        colorBarLink: '/img/world_geology_legend.jpg',
        default: true,
      },
    },
    terrains: {
      topo15: {
        displayName: 'SRTM15_PLUS V1',
        maxLevel: 8,
        defaultHeightScale: 30,
        heightScales: [10, 20, 30, 40, 50, 100],
        default: true,
      },
    },
  },
  global_lithological_map: {
    title: 'Global Lithological Map',
    aboutUrl: '/portal/geology',
    rasters: {
      global_lithological_map: {
        displayName: 'Global Lithological Map',
        maxLevel: 6,
        colorBar: '/img/click_me_to_see_legend.png',
        colorBarLink: '/img/global_lithological_map_legend.png',
        credit: 'EarthByte Group and GLiM, Hartmann and Moosdorf, 2012',
        default: true,
      },
    },
    terrains: {
      topo15: {
        displayName: 'SRTM15_PLUS V1',
        maxLevel: 8,
        defaultHeightScale: 30,
        heightScales: [1, 5, 10, 20, 30, 40, 50, 100],
      },
    },
  },
  topo15: {
    title: 'SRTM15_PLUS',
    aboutUrl: '/portal/srtm15',
    rasters: {
      topo15: {
        displayName: 'SRTM15_PLUS V1 ETOPO1',
        maxLevel: 8,
        colorBar: '/img/haxby-height-color-bar.png',
        default: true,
      },
      topo15_haxby: {
        displayName: 'SRTM15_PLUS V1 Haxby',
        maxLevel: 8,
        colorBar: '/img/haxby-topo15-color-bar.png',
      },
    },
    terrains: {
      topo15: {
        displayName: 'SRTM15_PLUS V1',
        maxLevel: 8,
        defaultHeightScale: 30,
        heightScales: [1, 5, 10, 20, 30, 40, 50, 100],
        default: true,
      },
    },
  },
} satisfies Record<string, ViewCfg>;

export type ViewName = keyof typeof VIEWS;

/** the old cesium/views.py defaulted to VGG-T when no ?view= was given */
export const DEFAULT_VIEW: ViewName = 'VGG-T';

/**
 * VIEWS keeps its literal type (so ViewName stays a union), which means indexing
 * it directly hides optional members like `time` on views that omit them --
 * always reach a view through here.
 */
export const getView = (name: ViewName): ViewCfg => VIEWS[name];

export const isViewName = (name: string): name is ViewName =>
  Object.prototype.hasOwnProperty.call(VIEWS, name);

export const defaultRasterName = (view: ViewCfg) =>
  Object.entries(view.rasters).find(([, raster]) => raster.default)?.[0] ??
  Object.keys(view.rasters)[0];

/** the terrain select always offers "None" first, so that's the fallback */
export const defaultTerrainName = (view: ViewCfg) =>
  Object.entries(view.terrains).find(([, terrain]) => terrain.default)?.[0] ?? TERRAIN_NONE;

export const defaultHeightScale = (view: ViewCfg, terrainName: string) =>
  terrainName === TERRAIN_NONE ? 0 : view.terrains[terrainName].defaultHeightScale;

/**
 * The two families of view, which the view picker offers one at a time. The
 * split is derived rather than configured: having a time range is exactly what
 * makes a view a paleo-reconstruction, so the two can't drift apart.
 */
export const VIEW_GROUPS = ['Present Day', 'Reconstructions'] as const;

export type ViewGroup = (typeof VIEW_GROUPS)[number];

export const groupOf = (view: ViewCfg): ViewGroup =>
  view.time ? 'Reconstructions' : 'Present Day';

export const viewNamesInGroup = (group: ViewGroup) =>
  (Object.keys(VIEWS) as ViewName[]).filter((name) => groupOf(getView(name)) === group);
