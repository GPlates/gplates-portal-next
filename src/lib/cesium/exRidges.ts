import type { PickableFeature } from './pickableGeoJson';

/**
 * The ExRidges view's filter dialog and info-panel field list, from the old
 * static/js/cesium/ExRidgesView.js (addQueryDlg / filterFeatures / nameMap).
 *
 * Every feature carries a RidgeTypeFlag: Extinct ridges are filtered by ocean and
 * tier; Active and AnalyzedActive ridges are each switched on or off as a whole.
 */

export const RIDGE_OCEANS = [
  ['Indian', 'Indian Ocean'],
  ['Atlantic', 'Atlantic Ocean'],
  ['Pacific', 'Pacific Ocean'],
  ['Marginal', 'Marginal Basins'],
] as const;

export const RIDGE_TIERS = ['PRIMARY', 'SECONDARY', 'EXCLUDED'] as const;

export type RidgeFilter = {
  oceans: string[];
  tiers: string[];
  active: boolean;
  analyzedActive: boolean;
};

/** what the old dialog opened with */
export const DEFAULT_RIDGE_FILTER: RidgeFilter = {
  oceans: RIDGE_OCEANS.map(([value]) => value),
  tiers: ['PRIMARY'],
  active: false,
  analyzedActive: false,
};

export function ridgeVisible(feature: PickableFeature, filter: RidgeFilter) {
  const p = feature.properties;
  switch (p.RidgeTypeFlag) {
    case 'Active':
      return filter.active;
    case 'AnalyzedActive':
      return filter.analyzedActive;
    case 'Extinct':
      return filter.oceans.includes(String(p.Ocean)) && filter.tiers.includes(String(p.Tier));
    default:
      return false;
  }
}

/** ExRidgesView's nameMap, minus the entries it had commented out */
export const RIDGE_INFO_FIELDS: Record<string, string> = {
  name: 'Segment Name',
  Portal_ID: 'Portal ID',
  Tier: 'Tier',
  Ocean: 'Ocean',
  RidgeType: 'Ridge Type',
  RefTimeCea: 'Time of Cessation and Reference',
  SpreadRate: 'Half-spreading Rate Before Extinction (mm/yr)',
  Duration: 'Duration of Spreading (Myr)',
  CorrectedB: 'Bathymetric Relief (m)',
  CorrectedG: 'Gravity anomaly (mGal)',
  GravHalfWa: 'Half-wavelength (km)',
  AnalyzedActiveRidge: 'Analyzed Active Ridge',
};
