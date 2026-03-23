import { useCallback } from 'react';

import { useMidiStore } from '../../stores/useMidiStore';
import { PRESET_SONGS } from '../../utils/constants';
import type { PresetSong } from '../../types/ui';

type PresetCardProps = {
  song: PresetSong;
  isActive: boolean;
  isLoading: boolean;
  onSelect: (id: string) => void;
};

function PresetCard({ song, isActive, isLoading, onSelect }: PresetCardProps): React.JSX.Element {
  const handleClick = useCallback((): void => {
    if (!isLoading) onSelect(song.id);
  }, [isLoading, onSelect, song.id]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={`Load ${song.title} by ${song.composer}`}
      aria-pressed={isActive}
      className={[
        /* glass card */
        'text-left rounded-2xl p-3 border transition-all duration-300',
        'backdrop-blur-xl backdrop-saturate-[180%]',
        'focus-visible:ring-2 focus-visible:ring-offset-2',
        'focus-visible:ring-[color:var(--color-accent-rose)]/50',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        isActive
          ? [
              'bg-[color:var(--color-accent-rose-light)]',
              'border-[color:var(--color-accent-rose)]/40',
              'shadow-[0_0_0_2px_var(--color-accent-rose)]',
            ].join(' ')
          : [
              'bg-white/55 border-white/30',
              'shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)]',
              'hover:bg-white/70 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]',
              'hover:scale-[1.02]',
            ].join(' '),
      ].join(' ')}
    >
      {/* Composer — small serif secondary */}
      <p
        className="text-[11px] font-medium truncate mb-0.5"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-secondary)' }}
      >
        {song.composer}
        {song.catalogNumber ? ` · ${song.catalogNumber}` : ''}
      </p>

      {/* Title — serif primary */}
      <p
        className="text-sm font-semibold leading-snug truncate"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
      >
        {song.title}
      </p>

      {/* Key + BPM — monospace tertiary */}
      <p
        className="text-[11px] mt-1 tabular-nums"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
      >
        {song.originalKey} · {song.estimatedBpm} BPM
      </p>
    </button>
  );
}

export function PresetSelector(): React.JSX.Element {
  const loadPreset = useMidiStore((s) => s.loadPreset);
  const isLoading = useMidiStore((s) => s.isLoading);
  const loadError = useMidiStore((s) => s.loadError);
  const fileName = useMidiStore((s) => s.fileName);

  const handleSelect = useCallback(
    (id: string): void => {
      void loadPreset(id);
    },
    [loadPreset],
  );

  /* Detect currently active preset by matching the file name pattern */
  const activeId = PRESET_SONGS.find((s) => fileName.includes(s.title))?.id ?? null;

  /* A preset-related error is one that mentions "Preset" or "MIDI file" */
  const isPresetError = loadError !== null && (
    loadError.includes('Preset') || loadError.includes('MIDI file')
  );

  return (
    <div className="flex flex-col gap-3 mt-4">
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Or pick from the classical collection
      </p>

      {/* 2-col mobile / 3-col desktop grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESET_SONGS.map((song) => (
          <PresetCard
            key={song.id}
            song={song}
            isActive={song.id === activeId}
            isLoading={isLoading}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Inline error / fallback guidance */}
      {isPresetError && (
        <div
          role="alert"
          className={[
            'rounded-xl px-4 py-3 text-xs border',
            'bg-amber-50/80 border-amber-300/60 backdrop-blur-md',
          ].join(' ')}
          style={{ color: '#92400E' }}
        >
          <p className="font-semibold mb-0.5">
            Preset MIDI file not available
          </p>
          <p style={{ color: '#B45309' }}>
            Place .mid files in <code className="font-mono bg-amber-100/60 px-1 rounded">public/presets/</code>,
            or drag &amp; drop your own MIDI file into the upload area above.
          </p>
        </div>
      )}
    </div>
  );
}
