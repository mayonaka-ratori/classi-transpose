/**
 * UI state types.
 */

export type SoundQuality = 'light' | 'high';

export type SoundFontInfo = {
  id: string;
  name: string;
  url: string;
  size: number;       // bytes
  cached: boolean;
  instrument: string; // e.g. "Piano", "Strings", "GM"
};

export type ExportOptions = {
  applyTranspose: boolean;
  applyBpm: boolean;
  selectedTracksOnly: boolean;
  selectedTrackIndices: number[];
};
