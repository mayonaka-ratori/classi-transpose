/**
 * Music theory types used across the app.
 */

export type KeyName =
  | 'C' | 'C♯' | 'D♭'
  | 'D' | 'D♯' | 'E♭'
  | 'E'
  | 'F' | 'F♯' | 'G♭'
  | 'G' | 'G♯' | 'A♭'
  | 'A' | 'A♯' | 'B♭'
  | 'B';

export type KeyMode = 'major' | 'minor';

export type KeySignatureDisplay = {
  name: KeyName;
  mode: KeyMode;
  label: string; // e.g. "E♭ major"
};

export type TransposeDirection = 'up' | 'down';

export type SemitoneOffset = number; // -12 to +12
