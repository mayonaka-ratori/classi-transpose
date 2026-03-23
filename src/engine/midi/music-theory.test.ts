import { describe, it, expect } from 'vitest';
import { semitoneToKey, keyToSemitone, getAllKeySignatures } from './music-theory';

describe('semitoneToKey', () => {
  it('maps 0 to C major', () => {
    const result = semitoneToKey(0, 'major');
    expect(result.label).toBe('C major');
  });

  it('maps +3 to E♭ major', () => {
    const result = semitoneToKey(3, 'major');
    expect(result.label).toBe('E♭ major');
  });

  it('wraps negative values correctly', () => {
    const result = semitoneToKey(-3, 'major');
    // -3 mod 12 = 9 → A major
    expect(result.label).toBe('A major');
  });

  it('handles minor keys', () => {
    const result = semitoneToKey(9, 'minor');
    expect(result.label).toBe('A minor');
  });
});

describe('keyToSemitone', () => {
  it('C → 0', () => expect(keyToSemitone('C')).toBe(0));
  it('E♭ → 3', () => expect(keyToSemitone('E♭')).toBe(3));
  it('D♭ and C♯ both → 1', () => {
    expect(keyToSemitone('D♭')).toBe(1);
    expect(keyToSemitone('C♯')).toBe(1);
  });
  it('F♯ and G♭ both → 6', () => {
    expect(keyToSemitone('F♯')).toBe(6);
    expect(keyToSemitone('G♭')).toBe(6);
  });
});

describe('getAllKeySignatures', () => {
  it('returns 12 major keys', () => {
    const keys = getAllKeySignatures('major');
    expect(keys).toHaveLength(12);
    expect(keys[0].label).toBe('C major');
  });
});
