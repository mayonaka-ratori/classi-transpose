import type { MidiData } from '../../types/midi';
import type { ExportOptions } from '../../types/ui';
import { buildExportedMidi } from '../../utils/midi-export';

/**
 * Export MIDI data with transpose and BPM modifications applied.
 *
 * This function delegates to the core `buildExportedMidi` utility which operates
 * directly on the raw ArrayBuffer for maximum fidelity. If `rawBuffer` is not
 * available (e.g. in unit tests), the `parsedMidi` reference can be used to
 * infer metadata, but the binary output always comes from the raw bytes.
 *
 * @param rawBuffer          The original MIDI ArrayBuffer (stored in useMidiStore).
 * @param _parsedMidi        Parsed metadata (currently unused by the binary path).
 * @param transposeSemitones Semitones to shift (-12 to +12).
 * @param tempoScale         Tempo multiplier (0.25 to 4.0).
 * @param _options           Export options (track filtering reserved for future use).
 * @returns                  A new ArrayBuffer containing the modified MIDI file.
 */
export function exportMidi(
  rawBuffer: ArrayBuffer,
  _parsedMidi: MidiData,
  transposeSemitones: number,
  tempoScale: number,
  _options: ExportOptions,
): ArrayBuffer {
  return buildExportedMidi(rawBuffer, { transposeSemitones, tempoScale });
}
