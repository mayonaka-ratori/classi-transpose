import type { MidiTrack } from '../../types/midi';

const MIDI_CHANNELS = 16;

/**
 * Maps channel number → whether that channel should be muted.
 * Only channels that have at least one assigned track are included.
 */
export type ChannelMuteMap = Partial<Record<number, boolean>>;

/**
 * Pure function: compute which channels should be muted given the current
 * mute/solo track sets.
 *
 * Rules:
 * - If any track is solo'd → mute all channels that have no solo'd track
 * - Otherwise → mute channels whose every assigned track is muted
 * - Channels with no assigned track are not included in the result
 * - Tracks with channel === null (multi-channel) are skipped for channel targeting
 */
export function computeChannelMutes(
  tracks: readonly MidiTrack[],
  mutedTracks: ReadonlySet<number>,
  soloTracks: ReadonlySet<number>,
): ChannelMuteMap {
  const result: ChannelMuteMap = {};
  const hasSolo = soloTracks.size > 0;

  for (let ch = 0; ch < MIDI_CHANNELS; ch++) {
    const channelTracks = tracks.filter((t) => t.channel === ch);
    if (channelTracks.length === 0) continue;

    if (hasSolo) {
      // Solo mode: mute unless at least one track on this channel is solo'd
      result[ch] = !channelTracks.some((t) => soloTracks.has(t.index));
    } else {
      // Normal mode: mute only if ALL tracks on this channel are muted
      result[ch] = channelTracks.every((t) => mutedTracks.has(t.index));
    }
  }

  return result;
}

/**
 * Determine the effective muted set for display purposes:
 * tracks that produce no sound given current mute/solo state.
 */
export function getEffectiveMutedTracks(
  tracks: readonly MidiTrack[],
  mutedTracks: ReadonlySet<number>,
  soloTracks: ReadonlySet<number>,
): Set<number> {
  const hasSolo = soloTracks.size > 0;
  const effective = new Set<number>();

  for (const track of tracks) {
    if (hasSolo) {
      if (!soloTracks.has(track.index)) effective.add(track.index);
    } else {
      if (mutedTracks.has(track.index)) effective.add(track.index);
    }
  }

  return effective;
}
