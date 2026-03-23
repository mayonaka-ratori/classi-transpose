import type { KeySignatureDisplay, KeyName, KeyMode } from '../../types/music';

/**
 * Map from semitone offset (0-11) to conventional key name.
 * Uses the most common enharmonic spelling.
 */
const MAJOR_KEY_NAMES: readonly KeyName[] = [
  'C', 'D♭', 'D', 'E♭', 'E', 'F',
  'F♯', 'G', 'A♭', 'A', 'B♭', 'B',
] as const;

const MINOR_KEY_NAMES: readonly KeyName[] = [
  'C', 'C♯', 'D', 'D♯', 'E', 'F',
  'F♯', 'G', 'G♯', 'A', 'B♭', 'B',
] as const;

/**
 * Convert a semitone offset (0-11) and mode to a display key signature.
 */
export function semitoneToKey(semitone: number, mode: KeyMode): KeySignatureDisplay {
  const normalized = ((semitone % 12) + 12) % 12;
  const names = mode === 'major' ? MAJOR_KEY_NAMES : MINOR_KEY_NAMES;
  const name = names[normalized];
  return {
    name,
    mode,
    label: `${name} ${mode}`,
  };
}

/**
 * Convert a key name to its semitone offset (0-11).
 */
export function keyToSemitone(keyName: KeyName): number {
  const semitones: Record<KeyName, number> = {
    'C': 0, 'C♯': 1, 'D♭': 1, 'D': 2, 'D♯': 3, 'E♭': 3,
    'E': 4, 'F': 5, 'F♯': 6, 'G♭': 6, 'G': 7, 'G♯': 8,
    'A♭': 8, 'A': 9, 'A♯': 10, 'B♭': 10, 'B': 11,
  };
  return semitones[keyName];
}

/**
 * Get all key signature options for a dropdown, given a mode.
 */
export function getAllKeySignatures(mode: KeyMode): KeySignatureDisplay[] {
  const names = mode === 'major' ? MAJOR_KEY_NAMES : MINOR_KEY_NAMES;
  return names.map((name) => ({
    name,
    mode,
    label: `${name} ${mode}`,
  }));
}
