import * as Cesium from 'cesium';
import { TILE_SERVER_URL } from './tileServer';

/**
 * Port of the old gplates-portal GPlatesImageryProvider (static/js/cesium/GPlatesImageryProvider.js).
 * Tiles are pre-cut PNG/JPG pyramids on disk as raster_tiles/{name}/{level}/{x}/{y}.{fmt},
 * or raster_tiles/{name}/{time}/{level}/{x}/{y}.{fmt} for paleo-reconstruction rasters.
 * The old app served them through a Django view (/get_tile/); here requestImage fetches
 * the tile file directly from the static tile server instead.
 */
export type GPlatesImageryProviderOptions = {
  name: string;
  format?: string;
  maxLevel?: number;
  creditText?: string;
  /** paleo-age in Ma; omitted for present-day rasters, which have no time dimension */
  time?: number;
};

/**
 * Deliberately does not `implement Cesium.ImageryProvider`: Cesium's own type
 * declarations describe a wider surface (readyPromise, tileDiscardPolicy, proxy,
 * request-cancellation overloads, ...) than the engine actually needs from a
 * custom provider at runtime. Duck-typed, like the original JS version; cast at
 * the call site where Cesium APIs expect a Cesium.ImageryProvider.
 */
export class GPlatesImageryProvider {
  private readonly _name: string;
  private readonly _format: string;
  private readonly _maxLevel: number;
  private readonly _time?: number;
  private readonly _tilingScheme: Cesium.GeographicTilingScheme;
  private readonly _errorEvent: Cesium.Event;
  private readonly _credit: Cesium.Credit;

  constructor(options: GPlatesImageryProviderOptions) {
    this._name = options.name;
    this._format = options.format || 'png';
    this._maxLevel = options.maxLevel ?? 4;
    this._time = options.time;
    this._tilingScheme = new Cesium.GeographicTilingScheme({});
    this._errorEvent = new Cesium.Event();
    this._credit = new Cesium.Credit(options.creditText || 'EarthByte Group');
  }

  get ready(): boolean {
    return true;
  }

  get tileWidth(): number {
    return 256;
  }

  get tileHeight(): number {
    return 256;
  }

  get maximumLevel(): number {
    return this._maxLevel;
  }

  get minimumLevel(): number {
    return 0;
  }

  get tilingScheme(): Cesium.GeographicTilingScheme {
    return this._tilingScheme;
  }

  get rectangle(): Cesium.Rectangle {
    return this._tilingScheme.rectangle;
  }

  get errorEvent(): Cesium.Event {
    return this._errorEvent;
  }

  get credit(): Cesium.Credit {
    return this._credit;
  }

  get hasAlphaChannel(): boolean {
    return true;
  }

  getTileCredits(): Cesium.Credit[] | undefined {
    return undefined;
  }

  pickFeatures(): undefined {
    return undefined;
  }

  /**
   * The tile pyramid on disk is TMS-style (row 0 at the south), while Cesium's
   * GeographicTilingScheme numbers rows from the north -- flip y to match, same
   * as the old build_tile_path()/GPlatesImageryProvider.js did.
   */
  requestImage(x: number, y: number, level: number) {
    const flippedY = Math.abs(y - (Math.pow(2, level) - 1));
    const path =
      this._time === undefined
        ? `${this._name}/${level}/${x}/${flippedY}`
        : `${this._name}/${this._time}/${level}/${x}/${flippedY}`;
    const url = `${TILE_SERVER_URL}/raster_tiles/${path}.${this._format}`;
    return Cesium.ImageryProvider.loadImage(this as unknown as Cesium.ImageryProvider, url);
  }
}
