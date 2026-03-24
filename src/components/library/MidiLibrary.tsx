import { useState, useCallback, useMemo } from 'react';

import { MIDI_CATALOG, getComposersByCategory } from '../../data/midi-catalog';
import type { MidiCategory, MidiPiece, ComposerGroup } from '../../data/midi-catalog';
import { useTranslation } from '../../i18n';
import { CategoryFilter } from './CategoryFilter';
import { ComposerSelector } from './ComposerSelector';
import { PieceList } from './PieceList';

export function MidiLibrary(): React.JSX.Element {
  const [category, setCategory] = useState<MidiCategory | 'all'>('all');
  const [selectedComposerFull, setSelectedComposerFull] = useState<string | null>(null);
  const { t } = useTranslation();

  // Groups visible for the current category
  const visibleGroups: ComposerGroup[] = useMemo(
    () => (category === 'all' ? MIDI_CATALOG : getComposersByCategory(category)),
    [category],
  );

  // When category changes, reset composer if it is no longer in the list
  const handleCategoryChange = useCallback((next: MidiCategory | 'all') => {
    setCategory(next);
    setSelectedComposerFull((prev) => {
      const groups = next === 'all' ? MIDI_CATALOG : getComposersByCategory(next);
      const stillValid = groups.some((g) => g.composerFull === prev);
      return stillValid ? prev : null;
    });
  }, []);

  const handleComposerChange = useCallback((composerFull: string) => {
    setSelectedComposerFull(composerFull);
  }, []);

  // Pieces to show — either from selected composer or all visible groups
  const pieces: MidiPiece[] = useMemo(() => {
    if (selectedComposerFull) {
      const group = visibleGroups.find((g) => g.composerFull === selectedComposerFull);
      return group ? group.pieces : [];
    }
    return visibleGroups.flatMap((g) => g.pieces);
  }, [selectedComposerFull, visibleGroups]);

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-2">
        <h2
          className="text-base font-semibold"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
        >
          {t.library.title}
        </h2>
        <span
          className="text-xs"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
        >
          {t.library.pieces(pieces.length)}
        </span>
      </div>

      {/* Category filter pills */}
      <CategoryFilter selected={category} onChange={handleCategoryChange} />

      {/* Composer dropdown */}
      <ComposerSelector
        category={category}
        selected={selectedComposerFull}
        onChange={handleComposerChange}
      />

      {/* Piece cards */}
      <div
        className="overflow-y-auto pr-0.5 [&::-webkit-scrollbar]:hidden"
        style={{
          maxHeight: 'min(60vh, 500px)',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <PieceList pieces={pieces} />
      </div>

      {/* Attribution note */}
      <p
        className="text-xs text-center pt-1"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {t.library.attribution}
      </p>
    </div>
  );
}
