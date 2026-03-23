/**
 * Internal MIDI data representation.
 * Maps from spessasynth_core types — never expose library types outside engine/.
 */

export type MidiData = {
  header: MidiHeader;
  tracks: MidiTrack[];
  tempoEvents: TempoEvent[];
  keySignature: KeySignature | null;
};

export type MidiHeader = {
  format: 0 | 1 | 2;
  numTracks: number;
  ppq: number; // Pulses Per Quarter note
};

export type MidiTrack = {
  index: number;
  name: string;
  channel: number | null; // null if multi-channel track
  instrumentName: string;
  noteCount: number;
  notes: MidiNote[];
};

export type MidiNote = {
  midi: number;       // 0-127
  time: number;       // seconds
  duration: number;   // seconds
  velocity: number;   // 0-127
  channel: number;
};

export type TempoEvent = {
  time: number;           // seconds
  tick: number;
  microsecondsPerBeat: number;
  bpm: number;
};

export type KeySignature = {
  key: string;      // e.g. "C", "E♭"
  mode: 'major' | 'minor';
};
