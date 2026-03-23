import type { MidiNote } from '../../types/midi';

const DRUM_CHANNEL = 9; // 0-indexed
const MIN_NOTE = 0;
const MAX_NOTE = 127;

/**
 * Transpose an array of MIDI notes by the given number of semitones.
 * Drum channel (9) notes are returned unchanged.
 * Notes that would exceed 0-127 are clamped.
 */
export function transposeNotes(
  notes: readonly MidiNote[],
  semitones: number,
): MidiNote[] {
  return notes.map((note) => {
    if (note.channel === DRUM_CHANNEL) {
      return { ...note };
    }
    const transposed = Math.max(MIN_NOTE, Math.min(MAX_NOTE, note.midi + semitones));
    return { ...note, midi: transposed };
  });
}
