import type * as CesiumNS from 'cesium';
import { circleImage } from './pointImages';
import { RiftColorBy, riftColor, riftScale } from './riftColormaps';
import { RiftDataset, RiftTrack } from './riftTracks';

/**
 * The rift points on the globe: the old static/js/cesium/RiftObliquityView.js
 * together with the GeoJsonLayer + Utils.createPrimitives() it drew its points
 * through.
 *
 * The old view refetched a whole GeoJSON layer per frame and rebuilt its
 * billboards. Here every track owns one billboard for the life of the layer and
 * a frame change just moves, recolours, resizes and shows or hides it, so
 * playing 241 frames at 4 a second allocates nothing.
 *
 * Colour and size are not in the data (see riftTracks.ts): obliquity views
 * colour by obliquity and velocity views by velocity, both over the same
 * points, and size always follows velocity.
 */

/**
 * One rift point, and the Cesium pick id of its marker. `index` is where in the
 * track the current frame is; it moves as the frame changes, which is what lets
 * a pick lead both to the point under the cursor *and* to the whole history the
 * chart needs.
 */
export class RiftPoint {
  index = -1;

  constructor(readonly track: RiftTrack) {}

  get id() {
    return this.track.id;
  }

  get present() {
    return this.index >= 0;
  }

  get time() {
    return this.track.t[this.index];
  }

  get lon() {
    return this.track.lon[this.index];
  }

  get lat() {
    return this.track.lat[this.index];
  }

  get velocity() {
    return this.track.v[this.index];
  }

  get obliquity() {
    return this.track.o[this.index];
  }
}

export type RiftPointsLayer = {
  /** show the points of one frame, hiding the rest */
  setFrame: (time: number) => void;
  /** the old mouse-move handler doubled the size of whatever was under the cursor */
  highlight: (point: RiftPoint | null) => void;
  /** the old left-click handler dropped a chartreuse "O" pin on the point picked */
  pin: (point: RiftPoint | null) => void;
  addTo: (scene: CesiumNS.Scene) => void;
  removeFrom: (scene: CesiumNS.Scene) => void;
  destroy: () => void;
};

/** Utils.createPrimitives gave every point marker this distance scaling */
const SCALE_BY_DISTANCE = [1.5e4, 1.5, 1.5e7, 0.4] as const;

export function createRiftPointsLayer(
  Cesium: typeof CesiumNS,
  dataset: RiftDataset,
  colorBy: RiftColorBy,
): RiftPointsLayer {
  const markers = new Cesium.BillboardCollection();
  const pins = new Cesium.BillboardCollection();
  const pinBuilder = new Cesium.PinBuilder();
  const image = circleImage();
  const scaleByDistance = new Cesium.NearFarScalar(...SCALE_BY_DISTANCE);

  const points = new Map<RiftTrack, RiftPoint>();
  const billboards = new Map<RiftPoint, CesiumNS.Billboard>();
  for (const track of dataset.tracks) {
    const point = new RiftPoint(track);
    points.set(track, point);
    billboards.set(
      point,
      markers.add({
        image,
        show: false,
        // a billboard needs a position from the start; the first setFrame call
        // replaces it with the one for that frame
        position: Cesium.Cartesian3.fromDegrees(track.lon[0], track.lat[0]),
        scaleByDistance,
        id: point,
      }),
    );
  }

  // the points on screen, so a frame change only has to touch those twice
  let shown: RiftPoint[] = [];
  let highlighted: RiftPoint | null = null;

  const baseScale = (point: RiftPoint) => riftScale(point.velocity);

  return {
    setFrame(time) {
      for (const point of shown) {
        billboards.get(point)!.show = false;
        point.index = -1;
      }
      highlighted = null;
      shown = [];

      for (const { track, index } of dataset.byTime.get(time) ?? []) {
        const point = points.get(track)!;
        point.index = index;
        const billboard = billboards.get(point)!;
        billboard.position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat);
        const [r, g, b] = riftColor(colorBy, colorBy === 'obliquity' ? point.obliquity : point.velocity);
        billboard.color = new Cesium.Color(r, g, b, 1);
        billboard.scale = baseScale(point);
        billboard.show = true;
        shown.push(point);
      }
    },

    highlight(point) {
      if (highlighted === point) return;
      if (highlighted?.present) {
        billboards.get(highlighted)!.scale = baseScale(highlighted);
      }
      highlighted = point;
      if (point?.present) billboards.get(point)!.scale = baseScale(point) * 2;
    },

    pin(point) {
      pins.removeAll();
      if (!point?.present) return;
      pins.add({
        image: pinBuilder.fromText('O', Cesium.Color.CHARTREUSE, 32),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
      });
    },

    addTo(scene) {
      scene.primitives.add(markers);
      scene.primitives.add(pins);
    },

    removeFrom(scene) {
      // PrimitiveCollection destroys what it removes by default
      scene.primitives.remove(markers);
      scene.primitives.remove(pins);
    },

    destroy() {
      markers.destroy();
      pins.destroy();
    },
  };
}

/** the rift point behind a scene.pick()/drillPick() result, if it is one of ours */
export const pickedRiftPoint = (picked: unknown): RiftPoint | null => {
  const id = (picked as { id?: unknown } | undefined)?.id;
  return id instanceof RiftPoint && id.present ? id : null;
};
