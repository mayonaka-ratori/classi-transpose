import { useCallback } from 'react';

import { useMidiStore } from '../../stores/useMidiStore';
import { useTranslation } from '../../i18n';
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

// ── SVG icons ─────────────────────────────────────────────────────────────────

function SpeakerOnIcon(): React.JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function SpeakerOffIcon(): React.JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function StarFilledIcon(): React.JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"
      fill="currentColor" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarOutlineIcon(): React.JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ── TrackRow ──────────────────────────────────────────────────────────────────

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
  const { t } = useTranslation();

  const handleMuteChange = useCallback((): void => {
    onToggleMute(track.index);
  }, [onToggleMute, track.index]);

  const handleSolo = useCallback((): void => {
    onToggleSolo(track.index);
  }, [onToggleSolo, track.index]);

  const trackLabel = track.name || t.tracks.trackFallback(track.index + 1);
  const channelLabel = track.channel !== null ? t.tracks.channel(track.channel + 1) : t.tracks.multi;

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
      {/* Speaker icon — mute toggle */}
      <button
        type="button"
        onClick={handleMuteChange}
        aria-label={`${isMuted ? t.tracks.unmute : t.tracks.mute} ${trackLabel}`}
        aria-pressed={isMuted}
        className={[
          'w-10 h-10 rounded-lg shrink-0',
          'flex items-center justify-center',
          'border transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-offset-1',
          isMuted
            ? 'bg-[color:var(--color-accent-rose-light)] border-[color:var(--color-accent-rose)]/30 text-[color:var(--color-accent-rose)]'
            : 'bg-white/40 border-white/30 text-[color:var(--color-text-tertiary)] hover:bg-white/60',
        ].join(' ')}
      >
        {isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
      </button>

      {/* Instrument emoji */}
      <span aria-hidden="true" className="text-base shrink-0">
        {trackIcon(track)}
      </span>

      {/* Track info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span
          className="block text-sm font-medium truncate"
          style={{ color: isEffectivelyMuted ? 'var(--color-text-tertiary)' : 'var(--color-text-on-glass)' }}
        >
          {trackLabel}
        </span>
        <span className="block text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
          {channelLabel}
          {track.instrumentName ? ` · ${track.instrumentName}` : ''}
          {` · ${t.tracks.noteCount(track.noteCount)}`}
        </span>
      </div>

      {/* Star icon — solo toggle */}
      <button
        type="button"
        onClick={handleSolo}
        aria-label={`${isSolo ? t.tracks.unsolo : t.tracks.solo} ${trackLabel}`}
        aria-pressed={isSolo}
        className={[
          'w-10 h-10 rounded-lg shrink-0',
          'flex items-center justify-center',
          'border transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-offset-1',
          isSolo
            ? 'bg-[color:var(--color-accent-rose)] border-[color:var(--color-accent-rose)] text-white'
            : 'bg-white/40 border-white/30 text-[color:var(--color-text-tertiary)] hover:bg-white/60',
        ].join(' ')}
      >
        {isSolo ? <StarFilledIcon /> : <StarOutlineIcon />}
      </button>
    </div>
  );
}

// ── TrackList ─────────────────────────────────────────────────────────────────

export function TrackList(): React.JSX.Element {
  const tracks = useMidiStore((s) => s.tracks);
  const mutedTracks = useMidiStore((s) => s.mutedTracks);
  const soloTracks = useMidiStore((s) => s.soloTracks);
  const toggleMuteTrack = useMidiStore((s) => s.toggleMuteTrack);
  const toggleSoloTrack = useMidiStore((s) => s.toggleSoloTrack);
  const { t } = useTranslation();

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
          {t.tracks.label}
        </h3>
        {hasSolo && (
          <span className="text-xs font-semibold" style={{ color: 'var(--color-accent-rose)' }}>
            {t.tracks.soloActive}
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
