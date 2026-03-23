import { useCallback } from 'react';

import { useMidiStore } from '../../stores/useMidiStore';
import type { MidiPiece } from '../../data/midi-catalog';
import { MIDI_CATALOG } from '../../data/midi-catalog';

/** Flatten catalog to a fixed list of featured available pieces (max 6). */
function getFeaturedPieces(): MidiPiece[] {
  const pieces: MidiPiece[] = [];
  for (const group of MIDI_CATALOG) {
    for (const piece of group.pieces) {
      if (piece.available !== false) {
        pieces.push(piece);
        if (pieces.length >= 6) return pieces;
      }
    }
  }
  return pieces;
}

// ── PresetCard ────────────────────────────────────────────────────────────────

type PresetCardProps = {
  piece: MidiPiece;
  isActive: boolean;
  isLoading: boolean;
  onSelect: (piece: MidiPiece) => void;
};

function PresetCard({
  piece,
  isActive,
  isLoading,
  onSelect,
}: PresetCardProps): React.JSX.Element {
  const handleClick = useCallback((): void => {
    if (!isLoading) onSelect(piece);
  }, [isLoading, onSelect, piece]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={`Load ${piece.title} by ${piece.composerFull}`}
      aria-pressed={isActive}
      className={[
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
        {piece.composer}
        {piece.opus ? ` · ${piece.opus}` : ''}
      </p>

      {/* Title — serif primary */}
      <p
        className="text-sm font-semibold leading-snug truncate"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
      >
        {piece.title}
      </p>

      {/* Key + BPM — monospace tertiary */}
      {(piece.key !== undefined || piece.estimatedBpm !== undefined) && (
        <p
          className="text-[11px] mt-1 tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
        >
          {piece.key ?? ''}
          {piece.key !== undefined && piece.estimatedBpm !== undefined ? ' · ' : ''}
          {piece.estimatedBpm !== undefined ? `${piece.estimatedBpm} BPM` : ''}
        </p>
      )}
    </button>
  );
}

// ── PresetSelector ────────────────────────────────────────────────────────────

/**
 * Compact grid of featured preset pieces.
 * Used as a secondary entry point (e.g. inside FileUploader area).
 * The primary preset browser is MidiLibrary.
 */
export function PresetSelector(): React.JSX.Element {
  const loadPreset = useMidiStore((s) => s.loadPreset);
  const isLoading = useMidiStore((s) => s.isLoading);
  const loadError = useMidiStore((s) => s.loadError);
  const currentPiece = useMidiStore((s) => s.currentPiece);

  const featured = getFeaturedPieces();

  const handleSelect = useCallback(
    (piece: MidiPiece): void => {
      void loadPreset(piece);
    },
    [loadPreset],
  );

  const isPresetError =
    loadError !== null &&
    (loadError.includes('Preset') || loadError.includes('MIDI file'));

  return (
    <div className="flex flex-col gap-3 mt-4">
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Or pick from the classical collection
      </p>

      {/* 2-col grid */}
      <div className="grid grid-cols-2 gap-3">
        {featured.map((piece) => (
          <PresetCard
            key={piece.id}
            piece={piece}
            isActive={currentPiece?.id === piece.id}
            isLoading={isLoading}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {isPresetError && (
        <div
          role="alert"
          className="rounded-xl px-4 py-3 text-xs border bg-amber-50/80 border-amber-300/60 backdrop-blur-md"
          style={{ color: '#92400E' }}
        >
          <p className="font-semibold mb-0.5">Preset MIDI file not available</p>
          <p style={{ color: '#B45309' }}>
            Place .mid files in{' '}
            <code className="font-mono bg-amber-100/60 px-1 rounded">public/presets/</code>, or
            drag &amp; drop your own MIDI file into the upload area above.
          </p>
        </div>
      )}
    </div>
  );
}
