import { useCallback } from 'react';

import { MIDI_CATALOG, getComposersByCategory } from '../../data/midi-catalog';
import type { MidiCategory, ComposerGroup } from '../../data/midi-catalog';
import { useTranslation } from '../../i18n';

type ComposerSelectorProps = {
  category: MidiCategory | 'all';
  selected: string | null;   // composerFull
  onChange: (composerFull: string) => void;
};

export function ComposerSelector({
  category,
  selected,
  onChange,
}: ComposerSelectorProps): React.JSX.Element {
  const groups: ComposerGroup[] =
    category === 'all' ? MIDI_CATALOG : getComposersByCategory(category);
  const { t, lang } = useTranslation();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className="relative">
      <select
        aria-label={t.library.composerAriaLabel}
        value={selected ?? ''}
        onChange={handleChange}
        className={[
          'w-full appearance-none rounded-xl px-4 py-2.5 pr-10 text-sm',
          'bg-white/50 backdrop-blur-md border border-white/30',
          'outline-none cursor-pointer',
          'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50',
          'transition-colors duration-200 hover:bg-white/65',
        ].join(' ')}
        style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--color-text-on-glass)',
        }}
      >
        {!selected && (
          <option value="" disabled>
            {t.library.selectComposer}
          </option>
        )}
        {groups.map((group) => (
          <option key={group.composerFull} value={group.composerFull}>
            {lang === 'ja' && group.composerJa ? group.composerJa : group.composerFull} ({group.pieces.length})
          </option>
        ))}
      </select>

      {/* Custom chevron */}
      <div
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
