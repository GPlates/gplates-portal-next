import * as Cesium from 'cesium';
import { TILE_SERVER_URL } from './tileServer';
import { gunzip } from './gunzip';

/**
 * Port of the old gplates-portal GPlatesTerrainProvider (static/js/cesium/GPlatesTerrainProvider.js).
 * Tiles are pre-cut quantized heightmaps on disk as terrain_tiles/{name}/{level}/{x}/{y}.terrain.
 * The old app served them through a Django view (/get_terrain/); here requestTileGeometry
 * fetches the tile file directly from the static tile server instead.
 */
export type GPlatesTerrainProviderOptions = {
  name?: string;
  maxLevel?: number;
  creditText?: string;
};

/**
 * Deliberately does not `implement Cesium.TerrainProvider` -- see the note on
 * GPlatesImageryProvider. Duck-typed; cast at the call site instead.
 */
export class GPlatesTerrainProvider {
  private readonly _name: string;
  private readonly _maxLevel: number;
  private readonly _errorEvent: Cesium.Event;
  private readonly _credit?: Cesium.Credit;
  private readonly _tilingScheme: Cesium.GeographicTilingScheme;
  private readonly _levelZeroMaximumGeometricError: number;
  readonly _terrainDataStructure: {
    heightScale: number;
    heightOffset: number;
    elementsPerHeight: number;
    stride: number;
    elementMultiplier: number;
    isBigEndian: boolean;
  };

  constructor(options: GPlatesTerrainProviderOptions = {}) {
    this._name = options.name || 'DNS';
    this._maxLevel = options.maxLevel ?? 7;
    this._errorEvent = new Cesium.Event();
    if (options.creditText) {
      this._credit = new Cesium.Credit(options.creditText);
    }
    this._tilingScheme = new Cesium.GeographicTilingScheme({
      numberOfLevelZeroTilesX: 2,
      numberOfLevelZeroTilesY: 1,
    });
    this._levelZeroMaximumGeometricError =
      Cesium.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
        this._tilingScheme.ellipsoid,
        65,
        this._tilingScheme.getNumberOfXTilesAtLevel(0),
      );
    this._terrainDataStructure = {
      heightScale: 1.0,
      heightOffset: 0.0,
      elementsPerHeight: 1,
      stride: 1,
      elementMultiplier: 256.0,
      isBigEndian: false,
    };
  }

  get ready(): boolean {
    return true;
  }

  get errorEvent(): Cesium.Event {
    return this._errorEvent;
  }

  get credit(): Cesium.Credit | undefined {
    return this._credit;
  }

  get tilingScheme(): Cesium.GeographicTilingScheme {
    return this._tilingScheme;
  }

  get hasWaterMask(): boolean {
    return false;
  }

  /**
   * The tile pyramid on disk is TMS-style (row 0 at the south), while Cesium's
   * GeographicTilingScheme numbers rows from the north -- flip y to match, same
   * as the old GPlatesTerrainProvider.js did.
   */
  async requestTileGeometry(x: number, y: number, level: number) {
    if (!this.getTileDataAvailable(x, y, level)) {
      return undefined;
    }

    const flippedY = Math.abs(y - (Math.pow(2, level) - 1));
    const url = `${TILE_SERVER_URL}/terrain_tiles/${this._name}/${level}/${x}/${flippedY}.terrain`;

    const compressed = await Cesium.Resource.fetchArrayBuffer({
      url,
      headers: {
        Accept: 'application/vnd.quantized-mesh,application/octet-stream;q=0.9,*/*;q=0.01',
      },
    });
    if (!compressed) {
      return undefined;
    }

    // written by tools/CutTerrainTiles.py in gplates-portal.git via gzip.open
    const buffer = await gunzip(compressed);

    const heightBuffer = new Int16Array(buffer, 0, 65 * 65);
    return new Cesium.HeightmapTerrainData({
      buffer: heightBuffer,
      width: 65,
      height: 65,
      waterMask: new Uint8Array(
        buffer,
        heightBuffer.byteLength + 1,
        buffer.byteLength - heightBuffer.byteLength - 1,
      ),
      structure: this._terrainDataStructure,
    });
  }

  getLevelMaximumGeometricError(level: number): number {
    return this._levelZeroMaximumGeometricError / (1 << level);
  }

  getTileDataAvailable(_x: number, _y: number, level: number): boolean {
    return level <= this._maxLevel;
  }
}
