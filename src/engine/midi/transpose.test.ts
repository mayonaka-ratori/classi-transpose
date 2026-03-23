import { describe, it, expect } from 'vitest';
import { transposeNotes } from './transpose';
import type { MidiNote } from '../../types/midi';

const makeNote = (midi: number, channel = 0): MidiNote => ({
  midi,
  time: 0,
  duration: 1,
  velocity: 100,
  channel,
});

describe('transposeNotes', () => {
  it('transposes notes up by the given semitones', () => {
    const notes = [makeNote(60), makeNote(64), makeNote(67)];
    const result = transposeNotes(notes, 3);
    expect(result.map((n) => n.midi)).toEqual([63, 67, 70]);
  });

  it('transposes notes down by negative semitones', () => {
    const notes = [makeNote(60)];
    const result = transposeNotes(notes, -5);
    expect(result[0].midi).toBe(55);
  });

  it('clamps notes at 127 (upper bound)', () => {
    const notes = [makeNote(125)];
    const result = transposeNotes(notes, 5);
    expect(result[0].midi).toBe(127);
  });

  it('clamps notes at 0 (lower bound)', () => {
    const notes = [makeNote(2)];
    const result = transposeNotes(notes, -5);
    expect(result[0].midi).toBe(0);
  });

  it('does NOT transpose drum channel (channel 9)', () => {
    const notes = [makeNote(36, 9), makeNote(42, 9)];
    const result = transposeNotes(notes, 7);
    expect(result.map((n) => n.midi)).toEqual([36, 42]);
  });

  it('returns a new array (does not mutate input)', () => {
    const notes = [makeNote(60)];
    const result = transposeNotes(notes, 3);
    expect(result).not.toBe(notes);
    expect(notes[0].midi).toBe(60); // original unchanged
  });
});
