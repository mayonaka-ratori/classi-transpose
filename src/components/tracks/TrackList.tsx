import { useCallback } from 'react';

import { useMidiStore } from '../../stores/useMidiStore';
import { getEffectiveMutedTracks } from '../../engine/midi/track-state';
import type { MidiTrack } from '../../types/midi';

const DRUM_CHANNEL = 9;

function trackIcon(track: MidiTrack): string {
  if (track.channel === DRUM_CHANNEL) return '🥁';
  const name = track.instrumentName.toLowerCase();
  if (name.includes('violin') || name.includes('viola') || name.includes('cello') || name.includes('string')) return '🎻';
  if (name.includes('flute') || name.includes('oboe') || name.includes('clarinet') || name.includes('bassoon')) return '🪈';
  if (name.includes('trumpet') || name.includes('horn') || name.includes('trombone') || name.includes('tuba')) return '🎺';
  if (name.includes('guitar') || name.includes('bass')) return '🎸';
  if (name.includes('choir') || name.includes('voice') || name.includes('vocal')) return '🎤';
  return '🎹';
}

type TrackRowProps = {
  track: MidiTrack;
  isEffectivelyMuted: boolean;
  isMuted: boolean;
  isSolo: boolean;
  onToggleMute: (index: number) => void;
  onToggleSolo: (index: number) => void;
};

function TrackRow({
  track,
  isEffectivelyMuted,
  isMuted,
  isSolo,
  onToggleMute,
  onToggleSolo,
}: TrackRowProps): React.JSX.Element {
  const handleMuteChange = useCallback((): void => {
    onToggleMute(track.index);
  }, [onToggleMute, track.index]);

  const handleSolo = useCallback((): void => {
    onToggleSolo(track.index);
  }, [onToggleSolo, track.index]);

  const trackLabel = track.name || `Track ${track.index + 1}`;
  const channelLabel = track.channel !== null ? `Ch ${track.channel + 1}` : 'Multi';

  return (
    <div
      className={[
        /* glass-subtle row */
        'flex items-center gap-3 px-3 py-2.5 rounded-xl',
        'bg-white/35 backdrop-blur-lg border border-white/20',
        'transition-all duration-200',
        isEffectivelyMuted ? 'opacity-40' : 'opacity-100',
      ].join(' ')}
    >
      {/* Mute checkbox — checked = audible */}
      <input
        type="checkbox"
        id={`track-mute-${track.index}`}
        checked={!isMuted}
        onChange={handleMuteChange}
        aria-label={`${isMuted ? 'Unmute' : 'Mute'} ${trackLabel}`}
        className="w-4 h-4 rounded cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ accentColor: 'var(--color-accent-rose)' }}
      />

      {/* Instrument icon */}
      <span aria-hidden="true" className="text-base shrink-0">
        {trackIcon(track)}
      </span>

      {/* Track info */}
      <label
        htmlFor={`track-mute-${track.index}`}
        className="flex-1 min-w-0 cursor-pointer"
      >
        <span
          className="block text-sm font-medium truncate"
          style={{ color: 'var(--color-text-on-glass)' }}
        >
          {trackLabel}
        </span>
        <span className="block text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
          {channelLabel}
          {track.instrumentName ? ` · ${track.instrumentName}` : ''}
          {` · ${track.noteCount} notes`}
        </span>
      </label>

      {/* [M] Mute toggle button */}
      <button
        type="button"
        onClick={handleMuteChange}
        aria-label={`${isMuted ? 'Unmute' : 'Mute'} ${trackLabel}`}
        aria-pressed={isMuted}
        className={[
          'w-7 h-7 rounded-lg text-xs font-bold shrink-0',
          'border transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-offset-1',
          isMuted
            ? 'bg-[color:var(--color-accent-rose-light)] border-[color:var(--color-accent-rose)]/30 text-[color:var(--color-accent-rose)]'
            : 'bg-white/40 border-white/30 text-[color:var(--color-text-tertiary)] hover:bg-white/60',
        ].join(' ')}
      >
        M
      </button>

      {/* [S] Solo toggle button */}
      <button
        type="button"
        onClick={handleSolo}
        aria-label={`${isSolo ? 'Unsolo' : 'Solo'} ${trackLabel}`}
        aria-pressed={isSolo}
        className={[
          'w-7 h-7 rounded-lg text-xs font-bold shrink-0',
          'border transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-offset-1',
          isSolo
            ? 'bg-[color:var(--color-accent-rose)] border-[color:var(--color-accent-rose)] text-white'
            : 'bg-white/40 border-white/30 text-[color:var(--color-text-tertiary)] hover:bg-white/60',
        ].join(' ')}
      >
        S
      </button>
    </div>
  );
}

export function TrackList(): React.JSX.Element {
  const tracks = useMidiStore((s) => s.tracks);
  const mutedTracks = useMidiStore((s) => s.mutedTracks);
  const soloTracks = useMidiStore((s) => s.soloTracks);
  const toggleMuteTrack = useMidiStore((s) => s.toggleMuteTrack);
  const toggleSoloTrack = useMidiStore((s) => s.toggleSoloTrack);

  if (tracks.length === 0) return <></>;

  const effectiveMuted = getEffectiveMutedTracks(tracks, mutedTracks, soloTracks);
  const hasSolo = soloTracks.size > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Tracks
        </h3>
        {hasSolo && (
          <span className="text-xs font-semibold" style={{ color: 'var(--color-accent-rose)' }}>
            Solo active
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {tracks.map((track) => (
          <TrackRow
            key={track.index}
            track={track}
            isEffectivelyMuted={effectiveMuted.has(track.index)}
            isMuted={mutedTracks.has(track.index)}
            isSolo={soloTracks.has(track.index)}
            onToggleMute={toggleMuteTrack}
            onToggleSolo={toggleSoloTrack}
          />
        ))}
      </div>
    </div>
  );
}
