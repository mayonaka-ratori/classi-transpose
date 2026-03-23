import { BasicMIDI } from 'spessasynth_core';
import type { MidiData, MidiHeader, MidiTrack, TempoEvent, KeySignature } from '../../types/midi';

const KEY_SIGNATURE_META = 89; // midiMessageTypes.keySignature = 0x59
const NOTE_ON_STATUS = 0x90;
const NOTE_ON_MASK = 0xf0;

/**
 * Parse a MIDI file ArrayBuffer into internal MidiData representation.
 */
export function parseMidiFile(buffer: ArrayBuffer, fileName?: string): MidiData {
  const basicMidi = BasicMIDI.fromArrayBuffer(buffer, fileName);

  const header: MidiHeader = {
    format: 1,
    numTracks: basicMidi.tracks.length,
    ppq: basicMidi.timeDivision,
  };

  // tempoChanges is ordered from last to first — reverse to get chronological order
  const tempoEvents: TempoEvent[] = [...basicMidi.tempoChanges].reverse().map((tc) => ({
    tick: tc.ticks,
    time: basicMidi.midiTicksToSeconds(tc.ticks),
    bpm: tc.tempo,
    microsecondsPerBeat: Math.round(60_000_000 / tc.tempo),
  }));

  const keySignature = extractKeySignature(basicMidi);

  const tracks: MidiTrack[] = basicMidi.tracks.map((track, index) => {
    const channelArray = [...track.channels];
    const primaryChannel = channelArray.length > 0
      ? Math.min(...channelArray)
      : null;

    let noteCount = 0;
    for (const event of track.events) {
      const isNoteOn = (event.statusByte & NOTE_ON_MASK) === NOTE_ON_STATUS;
      const hasVelocity = event.data.length > 1 && event.data[1] > 0;
      if (isNoteOn && hasVelocity) {
        noteCount++;
      }
    }

    return {
      index,
      name: track.name.trim() || `Track ${index + 1}`,
      channel: primaryChannel,
      instrumentName: '',
      noteCount,
      notes: [], // full note extraction deferred to Phase 5 (MIDI export)
    };
  });

  return { header, tracks, tempoEvents, keySignature };
}

function extractKeySignature(midi: BasicMIDI): KeySignature | null {
  // Check extraMetadata for a key signature meta event
  for (const msg of midi.extraMetadata) {
    if (msg.statusByte === KEY_SIGNATURE_META && msg.data.length >= 2) {
      const sharps = new Int8Array([msg.data[0]])[0];
      const mode: 'major' | 'minor' = msg.data[1] === 1 ? 'minor' : 'major';
      return { key: sharpsToKeyName(sharps, mode), mode };
    }
  }
  // Also scan track events for key signature
  for (const track of midi.tracks) {
    for (const msg of track.events) {
      if (msg.statusByte === KEY_SIGNATURE_META && msg.data.length >= 2) {
        const sharps = new Int8Array([msg.data[0]])[0];
        const mode: 'major' | 'minor' = msg.data[1] === 1 ? 'minor' : 'major';
        return { key: sharpsToKeyName(sharps, mode), mode };
      }
    }
  }
  return null;
}

const MAJOR_KEY_BY_SHARPS: Record<number, string> = {
  [-7]: 'C♭', [-6]: 'G♭', [-5]: 'D♭', [-4]: 'A♭',
  [-3]: 'E♭', [-2]: 'B♭', [-1]: 'F',
  [0]: 'C',
  [1]: 'G', [2]: 'D', [3]: 'A', [4]: 'E',
  [5]: 'B', [6]: 'F♯', [7]: 'C♯',
};

const MINOR_KEY_BY_SHARPS: Record<number, string> = {
  [-7]: 'A♭', [-6]: 'E♭', [-5]: 'B♭', [-4]: 'F',
  [-3]: 'C', [-2]: 'G', [-1]: 'D',
  [0]: 'A',
  [1]: 'E', [2]: 'B', [3]: 'F♯', [4]: 'C♯',
  [5]: 'G♯', [6]: 'D♯', [7]: 'A♯',
};

function sharpsToKeyName(sharps: number, mode: 'major' | 'minor'): string {
  const map = mode === 'major' ? MAJOR_KEY_BY_SHARPS : MINOR_KEY_BY_SHARPS;
  return map[sharps] ?? 'C';
}
