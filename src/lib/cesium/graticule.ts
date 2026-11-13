import type * as CesiumNS from 'cesium';

/**
 * Port of the old CesiumView graticule: a faint white grid drawn as an imagery
 * layer, plus lon/lat labels placed differently on the 3D globe and the flat
 * 2D/Columbus map (addGraticuleLabels3D / addGraticuleLabels2D).
 */
export function createGraticuleProvider(Cesium: typeof CesiumNS) {
  return new Cesium.GridImageryProvider({
    cells: 3,
    glowWidth: 0,
    backgroundColor: new Cesium.Color(0, 0, 0, 0),
    glowColor: new Cesium.Color(0, 0, 0, 0),
    color: new Cesium.Color(1, 1, 1, 0.2),
  });
}

const LABELS_3D: [string, number, number][] = [
  ['North Pole', 0, 90],
  ['South Pole', 0, -90],
  ['(0,0)', 0, 0],
  ['(60,0)', 60, 0],
  ['(120,0)', 120, 0],
  ['(-60,0)', -60, 0],
  ['(-120,0)', -120, 0],
  ['(+/-180,0)', 180, 0],
  ['(0,30)', 0, 30],
  ['(0,60)', 0, 60],
  ['(0,-30)', 0, -30],
  ['(0,-60)', 0, -60],
];

// longitudes along the top edge, latitudes down the right-hand edge
const LABELS_2D: [string, number, number][] = [
  ['0', 0, 90],
  ['60', 60, 90],
  ['120', 120, 90],
  ['-60', -60, 90],
  ['-120', -120, 90],
  ['-180', -180, 90],
  ['-30', 180, -30],
  ['-60', 180, -60],
  ['-90', 180, -90],
  ['0', 180, 0],
  ['30', 180, 30],
  ['60', 180, 60],
];

export function fillGraticuleLabels(
  Cesium: typeof CesiumNS,
  labels: CesiumNS.LabelCollection,
  flat: boolean,
) {
  labels.removeAll();
  const style = {
    font: '20px Helvetica',
    fillColor: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  };
  for (const [text, lon, lat] of flat ? LABELS_2D : LABELS_3D) {
    labels.add({ ...style, text, position: Cesium.Cartesian3.fromDegrees(lon, lat) });
  }
  if (flat) {
    // the corner, labelled for both axes
    const corner = Cesium.Cartesian3.fromDegrees(180, 90);
    labels.add({ ...style, text: '90', position: corner, verticalOrigin: Cesium.VerticalOrigin.TOP });
    labels.add({ ...style, text: '180', position: corner, horizontalOrigin: Cesium.HorizontalOrigin.RIGHT });
  }
}
