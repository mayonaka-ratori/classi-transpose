/**
 * soundfont-loader.ts
 *
 * Utilities for downloading SoundFont files with download-progress reporting.
 * NO React imports — pure TypeScript only.
 */

/**
 * Fetch a URL as an ArrayBuffer while reporting incremental download progress.
 *
 * Uses the Fetch ReadableStream API when a `Content-Length` header is present
 * so we can compute precise percentages. Falls back to a single-chunk download
 * (progress jumps from 0 → 100) when the header is absent (e.g. gzip encoding).
 *
 * @param url        The resource URL to fetch.
 * @param onProgress Callback receiving a percentage value 0–100.
 * @returns          A resolved ArrayBuffer of the downloaded resource.
 * @throws           If the HTTP response is not OK (status ≥ 400).
 */
export async function fetchWithProgress(
  url: string,
  onProgress: (pct: number) => void,
): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch SoundFont: HTTP ${response.status} ${response.statusText}`,
    );
  }

  const contentLength = Number(response.headers.get('content-length') ?? '0');
  const body = response.body;

  // If we have no content-length header or no readable body, skip streaming
  if (contentLength === 0 || body === null) {
    onProgress(10); // show some initial progress to indicate activity
    const buffer = await response.arrayBuffer();
    onProgress(100);
    return buffer;
  }

  // Stream with progress
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    // Report 1–99 during download; 100 is only emitted after combining chunks
    onProgress(Math.min(99, Math.round((loaded / contentLength) * 100)));
  }

  // Combine all chunks into a single contiguous ArrayBuffer
  const combined = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  onProgress(100);
  return combined.buffer;
}
