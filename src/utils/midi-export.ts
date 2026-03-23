/**
 * midi-export.ts
 *
 * Core MIDI transformation utility used for export.
 * Clones the original MIDI, applies transpose and tempo changes, then writes
 * a Standard MIDI File binary.
 *
 * NO React imports — pure TypeScript only.
 */
import { BasicMIDI, midiMessageTypes } from 'spessasynth_core';
import type { DesiredChannelTranspose } from 'spessasynth_core';

import { DRUM_CHANNEL } from './constants';

/** All 16 MIDI channels (0-15) except the drum channel (9). */
const PITCHED_CHANNELS: readonly number[] = Array.from(
  { length: 16 },
  (_, i) => i,
).filter((ch) => ch !== DRUM_CHANNEL);

export type MidiExportOptions = {
  /** Semitones to shift every non-drum note. 0 = no change. */
  transposeSemitones: number;
  /** Tempo multiplier. 1.0 = original speed, 2.0 = double speed. */
  tempoScale: number;
};

/**
 * Build an exported MIDI ArrayBuffer with transpose and tempo changes applied.
 *
 * The input buffer is never mutated; a deep clone via `BasicMIDI.copyFrom()` is used.
 *
 * @param rawBuffer  Original MIDI file bytes (must start with "MThd").
 * @param options    Transpose and tempo options to bake into the file.
 * @returns          A new ArrayBuffer containing a valid Standard MIDI File.
 */
export function buildExportedMidi(
  rawBuffer: ArrayBuffer,
  options: MidiExportOptions,
): ArrayBuffer {
  const { transposeSemitones, tempoScale } = options;

  // Parse original and deep-copy for mutation
  const original = BasicMIDI.fromArrayBuffer(rawBuffer);
  const copy = BasicMIDI.copyFrom(original);

  // ── Transpose ─────────────────────────────────────────────────────────
  // BasicMIDI.modify() shifts note-number bytes in NoteOn/NoteOff events.
  // Drum channel (9) is intentionally excluded.
  if (transposeSemitones !== 0) {
    const channelsToTranspose: DesiredChannelTranspose[] = PITCHED_CHANNELS.map(
      (channel) => ({ channel, keyShift: transposeSemitones }),
    );
    copy.modify({
      programChanges: [],
      controllerChanges: [],
      channelsToClear: [],
      channelsToTranspose,
      clearDrumParams: false,
    });
  }

  // ── Tempo ─────────────────────────────────────────────────────────────
  // Set Tempo meta-events store microseconds-per-beat as a 3-byte big-endian
  // integer in event.data. Scaling: new_µs = round(old_µs / tempoScale).
  //   tempoScale > 1.0  → more BPM  → fewer µs per beat
  //   tempoScale < 1.0  → fewer BPM → more µs per beat
  if (tempoScale !== 1.0 && tempoScale > 0) {
    const SET_TEMPO = midiMessageTypes.setTempo; // 0x51 = 81
    for (const track of copy.tracks) {
      for (const event of track.events) {
        if (event.statusByte === SET_TEMPO && event.data.length >= 3) {
          const oldUs =
            ((event.data[0] & 0xff) << 16) |
            ((event.data[1] & 0xff) << 8) |
            (event.data[2] & 0xff);
          const newUs = Math.max(1, Math.round(oldUs / tempoScale));
          event.data[0] = (newUs >> 16) & 0xff;
          event.data[1] = (newUs >> 8) & 0xff;
          event.data[2] = newUs & 0xff;
        }
      }
    }
    // Recalculate duration and cached tempoChanges from updated track events.
    copy.flush(false);
  }

  return copy.writeMIDI();
}

/**
 * Build a sanitized download file name.
 *
 * Format: `{baseName}_transposed_{sign}{semitones}_bpm{bpm}.mid`
 *
 * @param rawFileName  The store's fileName, e.g. "Moonlight Sonata — Beethoven"
 *                     or "my_piece.mid".
 * @param semitones    Current transpose value (-12 to +12).
 * @param bpm          Target BPM to embed in the name (typically originalBpm × tempoScale).
 */
export function buildExportFileName(
  rawFileName: string,
  semitones: number,
  bpm: number,
): string {
  // Drop ".mid" / ".midi" extension and optional " — Composer" suffix
  const withoutExt = rawFileName.replace(/\.(midi?)$/i, '');
  const basePart = withoutExt.includes(' — ')
    ? (withoutExt.split(' — ')[0] ?? withoutExt)
    : withoutExt;

  // Sanitize: replace non-alphanumeric chars with underscores, collapse runs
  const safeName = basePart
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  const semitoneStr = semitones >= 0 ? `+${semitones}` : `${semitones}`;
  const bpmRounded = Math.round(bpm);

  return `${safeName}_transposed_${semitoneStr}_bpm${bpmRounded}.mid`;
}
