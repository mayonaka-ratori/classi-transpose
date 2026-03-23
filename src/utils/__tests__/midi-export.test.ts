import { describe, it, expect } from 'vitest';
import { MIDIBuilder, BasicMIDI } from 'spessasynth_core';

import { buildExportedMidi, buildExportFileName } from '../midi-export';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Creates a minimal Format-1 MIDI with a single pitched note on channel 0.
 * The conductor track (track 0) holds the Set Tempo event; track 1 holds notes.
 */
function createTestMidi(bpm: number, noteNumber: number): ArrayBuffer {
  const builder = new MIDIBuilder({
    timeDivision: 480,
    initialTempo: bpm,
    format: 1,
    name: 'test',
  });
  builder.addNewTrack('Piano');
  builder.addNoteOn(0, 1, 0, noteNumber, 100);
  builder.addNoteOff(480, 1, 0, noteNumber, 0);
  return builder.writeMIDI();
}

/**
 * Creates a minimal MIDI with a single note on the drum channel (9).
 */
function createDrumMidi(noteNumber: number): ArrayBuffer {
  const builder = new MIDIBuilder({
    timeDivision: 480,
    initialTempo: 120,
    format: 1,
    name: 'drums',
  });
  builder.addNewTrack('Drums');
  builder.addNoteOn(0, 1, 9, noteNumber, 100);
  builder.addNoteOff(480, 1, 9, noteNumber, 0);
  return builder.writeMIDI();
}

// ── buildExportedMidi ─────────────────────────────────────────────────────────

describe('buildExportedMidi', () => {
  it('output starts with the MThd header magic bytes', () => {
    const input = createTestMidi(120, 60);
    const output = buildExportedMidi(input, { transposeSemitones: 0, tempoScale: 1.0 });
    const view = new Uint8Array(output, 0, 4);
    // "MThd" = 0x4D 0x54 0x68 0x64
    expect(view[0]).toBe(0x4d);
    expect(view[1]).toBe(0x54);
    expect(view[2]).toBe(0x68);
    expect(view[3]).toBe(0x64);
  });

  it('transposes notes up by +2 semitones on channel 0', () => {
    const input = createTestMidi(120, 60); // Middle C = 60
    const output = buildExportedMidi(input, { transposeSemitones: 2, tempoScale: 1.0 });
    const parsed = BasicMIDI.fromArrayBuffer(output);
    const ch0Notes = parsed.getNoteTimes()[0];
    expect(ch0Notes.length).toBeGreaterThan(0);
    expect(ch0Notes[0].midiNote).toBe(62); // C → D
  });

  it('transposes notes down by -3 semitones on channel 0', () => {
    const input = createTestMidi(120, 60);
    const output = buildExportedMidi(input, { transposeSemitones: -3, tempoScale: 1.0 });
    const parsed = BasicMIDI.fromArrayBuffer(output);
    const ch0Notes = parsed.getNoteTimes()[0];
    expect(ch0Notes[0].midiNote).toBe(57); // C → A
  });

  it('does NOT transpose notes on the drum channel (channel 9)', () => {
    const kickNote = 36;
    const input = createDrumMidi(kickNote);
    const output = buildExportedMidi(input, { transposeSemitones: 5, tempoScale: 1.0 });
    const parsed = BasicMIDI.fromArrayBuffer(output);
    const drumNotes = parsed.getNoteTimes()[9];
    expect(drumNotes.length).toBeGreaterThan(0);
    expect(drumNotes[0].midiNote).toBe(kickNote); // Unchanged
  });

  it('doubles the BPM when tempoScale is 2.0', () => {
    const input = createTestMidi(120, 60);
    const output = buildExportedMidi(input, { transposeSemitones: 0, tempoScale: 2.0 });
    const parsed = BasicMIDI.fromArrayBuffer(output);
    // tempoChanges is stored in reverse tick order; the change at tick 0 is last
    const firstChange = parsed.tempoChanges.find((tc) => tc.ticks === 0);
    expect(firstChange).toBeDefined();
    if (firstChange !== undefined) {
      expect(firstChange.tempo).toBeCloseTo(240, 0);
    }
  });

  it('halves the BPM when tempoScale is 0.5', () => {
    const input = createTestMidi(120, 60);
    const output = buildExportedMidi(input, { transposeSemitones: 0, tempoScale: 0.5 });
    const parsed = BasicMIDI.fromArrayBuffer(output);
    const firstChange = parsed.tempoChanges.find((tc) => tc.ticks === 0);
    expect(firstChange).toBeDefined();
    if (firstChange !== undefined) {
      expect(firstChange.tempo).toBeCloseTo(60, 0);
    }
  });

  it('applies both transpose and BPM change simultaneously', () => {
    const input = createTestMidi(100, 48); // C3, 100 BPM
    const output = buildExportedMidi(input, { transposeSemitones: 12, tempoScale: 1.5 });
    const parsed = BasicMIDI.fromArrayBuffer(output);

    const ch0Notes = parsed.getNoteTimes()[0];
    expect(ch0Notes[0].midiNote).toBe(60); // C3 + 12 = C4

    const firstChange = parsed.tempoChanges.find((tc) => tc.ticks === 0);
    expect(firstChange).toBeDefined();
    if (firstChange !== undefined) {
      expect(firstChange.tempo).toBeCloseTo(150, 0); // 100 × 1.5
    }
  });

  it('does not mutate the original ArrayBuffer', () => {
    const input = createTestMidi(120, 60);
    const snapshot = input.slice(0); // deep copy for comparison
    buildExportedMidi(input, { transposeSemitones: 7, tempoScale: 2.0 });
    expect(new Uint8Array(input)).toEqual(new Uint8Array(snapshot));
  });
});

// ── buildExportFileName ───────────────────────────────────────────────────────

describe('buildExportFileName', () => {
  it('formats a simple base name correctly', () => {
    expect(buildExportFileName('moonlight_sonata.mid', 3, 144)).toBe(
      'moonlight_sonata_transposed_+3_bpm144.mid',
    );
  });

  it('strips the " — Composer" suffix', () => {
    expect(buildExportFileName('Moonlight Sonata — Beethoven', -2, 96)).toBe(
      'Moonlight_Sonata_transposed_-2_bpm96.mid',
    );
  });

  it('uses "+" prefix for positive and zero semitones', () => {
    expect(buildExportFileName('test', 5, 120)).toContain('transposed_+5');
    expect(buildExportFileName('test', 0, 120)).toContain('transposed_+0');
  });

  it('uses "-" prefix for negative semitones', () => {
    expect(buildExportFileName('test', -3, 120)).toContain('transposed_-3');
  });

  it('rounds BPM to the nearest integer', () => {
    expect(buildExportFileName('piece', 0, 127.7)).toContain('bpm128');
    expect(buildExportFileName('piece', 0, 99.2)).toContain('bpm99');
  });

  it('sanitizes spaces and special chars in the base name', () => {
    const name = buildExportFileName('Op. 27 No. 2 (Adagio).midi', 0, 60);
    expect(name).toMatch(/^Op_27_No_2_Adagio_transposed/);
  });
});
