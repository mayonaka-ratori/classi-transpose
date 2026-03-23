import { describe, it, expect } from 'vitest';
import { computeChannelMutes, getEffectiveMutedTracks } from './track-state';
import type { MidiTrack } from '../../types/midi';

const makeTrack = (index: number, channel: number | null): MidiTrack => ({
  index,
  name: `Track ${index}`,
  channel,
  instrumentName: 'Piano',
  noteCount: 10,
  notes: [],
});

// Three tracks: Piano RH (ch 0), Piano LH (ch 1), Drums (ch 9)
const tracks: MidiTrack[] = [
  makeTrack(0, 0),
  makeTrack(1, 1),
  makeTrack(2, 9),
];

describe('computeChannelMutes — no mute, no solo', () => {
  it('returns empty mutes when nothing is muted or solo\'d', () => {
    const result = computeChannelMutes(tracks, new Set(), new Set());
    expect(result[0]).toBe(false);
    expect(result[1]).toBe(false);
    expect(result[9]).toBe(false);
  });
});

describe('computeChannelMutes — mute mode', () => {
  it('mutes the channel for a muted track', () => {
    const result = computeChannelMutes(tracks, new Set([0]), new Set());
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(false);
  });

  it('does not mute a channel if only some of its tracks are muted', () => {
    // Two tracks share channel 0
    const shared = [makeTrack(0, 0), makeTrack(1, 0)];
    const result = computeChannelMutes(shared, new Set([0]), new Set());
    // Track 1 is NOT muted, so channel 0 should still play
    expect(result[0]).toBe(false);
  });

  it('mutes the channel if ALL its tracks are muted', () => {
    const shared = [makeTrack(0, 0), makeTrack(1, 0)];
    const result = computeChannelMutes(shared, new Set([0, 1]), new Set());
    expect(result[0]).toBe(true);
  });
});

describe('computeChannelMutes — solo mode', () => {
  it('mutes all other channels when one track is solo\'d', () => {
    const result = computeChannelMutes(tracks, new Set(), new Set([0]));
    expect(result[0]).toBe(false); // solo'd channel is audible
    expect(result[1]).toBe(true);  // muted
    expect(result[9]).toBe(true);  // muted
  });

  it('unmutes all channels in the solo set', () => {
    const result = computeChannelMutes(tracks, new Set(), new Set([0, 1]));
    expect(result[0]).toBe(false);
    expect(result[1]).toBe(false);
    expect(result[9]).toBe(true);
  });

  it('ignores mutedTracks when solo is active', () => {
    // Even though track 0 is in mutedTracks, solo overrides it
    const result = computeChannelMutes(tracks, new Set([0]), new Set([0]));
    expect(result[0]).toBe(false);
  });
});

describe('computeChannelMutes — null-channel tracks', () => {
  it('skips tracks with channel === null', () => {
    const withNull = [makeTrack(0, null), makeTrack(1, 0)];
    const result = computeChannelMutes(withNull, new Set([0]), new Set());
    // Track 0 (null channel) should not affect channel 0
    expect(result[0]).toBe(false); // only track 1 on ch 0, not muted
  });
});

describe('getEffectiveMutedTracks', () => {
  it('returns muted track indices in normal mode', () => {
    const eff = getEffectiveMutedTracks(tracks, new Set([0, 2]), new Set());
    expect(eff.has(0)).toBe(true);
    expect(eff.has(1)).toBe(false);
    expect(eff.has(2)).toBe(true);
  });

  it('returns all non-solo tracks in solo mode', () => {
    const eff = getEffectiveMutedTracks(tracks, new Set(), new Set([1]));
    expect(eff.has(0)).toBe(true);  // not solo'd → effectively muted
    expect(eff.has(1)).toBe(false); // solo'd → audible
    expect(eff.has(2)).toBe(true);  // not solo'd → effectively muted
  });
});
