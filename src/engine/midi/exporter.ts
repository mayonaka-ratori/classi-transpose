import type { MidiData } from '../../types/midi';
import type { ExportOptions } from '../../types/ui';

/**
 * Export MIDI data with transpose and BPM modifications applied.
 * Returns a binary ArrayBuffer of a Standard MIDI File.
 */
export function exportMidi(
  _original: MidiData,
  _transposeSemitones: number,
  _tempoScale: number,
  _options: ExportOptions,
): ArrayBuffer {
  // TODO: Implement with spessasynth_core
  // 1. Clone original data
  // 2. If options.applyTranspose → apply transpose to note pitches
  // 3. If options.applyBpm → scale tempo events
  // 4. If options.selectedTracksOnly → filter tracks
  // 5. Write to SMF binary
  throw new Error('Not implemented');
}
