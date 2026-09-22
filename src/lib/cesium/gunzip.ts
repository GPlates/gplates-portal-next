/**
 * Both the .terrain tiles and the .geojson.gz files are stored gzip-compressed
 * on disk. The old Django views served them as-is with a "Content-Encoding:
 * gzip" header so the browser decompressed them transparently; a plain
 * static/WebDAV file server doesn't do that, so they're unzipped here instead.
 */
export async function gunzip(compressed: ArrayBuffer): Promise<ArrayBuffer> {
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
  return await new Response(stream).arrayBuffer();
}
