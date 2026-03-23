import { useCallback } from 'react';

import { useMidiStore } from '../../stores/useMidiStore';
import type { MidiPiece } from '../../data/midi-catalog';

type PieceListProps = {
  pieces: MidiPiece[];
};

type PieceCardProps = {
  piece: MidiPiece;
  isActive: boolean;
  onSelect: (piece: MidiPiece) => void;
};

function PieceCard({ piece, isActive, onSelect }: PieceCardProps): React.JSX.Element {
  const isUnavailable = piece.available === false;

  const handleClick = useCallback(() => {
    if (!isUnavailable) onSelect(piece);
  }, [piece, onSelect, isUnavailable]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isUnavailable) {
        e.preventDefault();
        onSelect(piece);
      }
    },
    [piece, onSelect, isUnavailable],
  );

  return (
    <button
      type="button"
      aria-label={isUnavailable ? `${piece.title} (coming soon)` : `Load ${piece.title}`}
      aria-pressed={isActive}
      aria-disabled={isUnavailable}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={[
        'w-full text-left p-3 rounded-xl transition-all duration-200 outline-none',
        'border backdrop-blur-md',
        'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-1',
        isUnavailable
          ? 'bg-white/20 border-white/10 opacity-60 cursor-default'
          : isActive
            ? [
                'bg-[color:var(--color-accent-rose-light)] border-[color:var(--color-accent-rose)]/50',
                'shadow-[0_0_0_2px_var(--color-accent-rose)]',
              ].join(' ')
            : 'bg-white/35 border-white/20 hover:bg-white/55 hover:border-white/40',
      ].join(' ')}
    >
      {/* Title row with Coming soon badge */}
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-sm font-semibold leading-snug line-clamp-2"
          style={{
            fontFamily: 'var(--font-serif)',
            color: isUnavailable
              ? 'var(--color-text-tertiary)'
              : isActive
                ? 'var(--color-accent-rose)'
                : 'var(--color-text-on-glass)',
          }}
        >
          {piece.title}
        </p>
        {isUnavailable && (
          <span
            className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border"
            style={{
              color: 'var(--color-text-tertiary)',
              borderColor: 'rgba(168,162,158,0.3)',
              background: 'rgba(255,255,255,0.3)',
              lineHeight: '1.4',
            }}
          >
            Coming soon
          </span>
        )}
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        {piece.key && (
          <span
            className="text-xs"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
          >
            {piece.key}
          </span>
        )}
        {piece.opus && (
          <span
            className="text-xs"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {piece.opus}
          </span>
        )}
        {piece.estimatedDuration && (
          <span
            className="text-xs ml-auto"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
          >
            {piece.estimatedDuration}
          </span>
        )}
      </div>
    </button>
  );
}

export function PieceList({ pieces }: PieceListProps): React.JSX.Element {
  const currentPiece = useMidiStore((s) => s.currentPiece);
  const loadPreset = useMidiStore((s) => s.loadPreset);
  const isLoading = useMidiStore((s) => s.isLoading);

  const handleSelect = useCallback(
    (piece: MidiPiece) => {
      if (!isLoading && piece.available !== false) void loadPreset(piece);
    },
    [loadPreset, isLoading],
  );

  if (pieces.length === 0) {
    return (
      <p
        className="text-sm text-center py-6"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        No pieces found in this category.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {pieces.map((piece) => (
        <PieceCard
          key={piece.id}
          piece={piece}
          isActive={currentPiece?.id === piece.id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
