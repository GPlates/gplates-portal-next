import * as Cesium from 'cesium';
import { TILE_SERVER_URL } from './tileServer';

/**
 * The old AnimationView drew each frame as one whole-globe image, fetched via
 * the Django /portal/get_animation_frame/ view from data/Animations/{name}/,
 * where the files are named by time with two decimals ("385.20.png"). Here they
 * are read straight off the static tile server, under Animations/{name}/.
 */
export const animationFrameUrl = (name: string, ext: string, time: number) =>
  `${TILE_SERVER_URL}/Animations/${name}/${time.toFixed(2)}.${ext}`;

export function createAnimationFrameProvider(
  name: string,
  ext: string,
  time: number,
  credit = '',
) {
  const provider = new Cesium.SingleTileImageryProvider({
    url: animationFrameUrl(name, ext, time),
    credit: credit || undefined,
  });
  // a missing frame otherwise surfaces as an unhandled RuntimeError
  provider.readyPromise.catch(() =>
    console.warn(`animation frame missing: ${animationFrameUrl(name, ext, time)}`),
  );
  return provider;
}
