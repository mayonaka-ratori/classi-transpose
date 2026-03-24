import { useCallback } from 'react';

import { CATEGORIES } from '../../data/midi-catalog';
import type { MidiCategory } from '../../data/midi-catalog';
import { useTranslation } from '../../i18n';

type CategoryFilterProps = {
  selected: MidiCategory | 'all';
  onChange: (category: MidiCategory | 'all') => void;
};

export function CategoryFilter({ selected, onChange }: CategoryFilterProps): React.JSX.Element {
  const { lang, t } = useTranslation();

  const handleClick = useCallback(
    (id: MidiCategory | 'all') => () => { onChange(id); },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (id: MidiCategory | 'all') => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(id);
      }
    },
    [onChange],
  );

  const allIsActive = selected === 'all';

  return (
    <div
      role="tablist"
      aria-label={t.library.filterAriaLabel}
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      style={{
        WebkitOverflowScrolling: 'touch',
        maskImage: 'linear-gradient(90deg, transparent, black 12px, black calc(100% - 12px), transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12px, black calc(100% - 12px), transparent)',
      }}
    >
      {/* "All" pill */}
      <button
        type="button"
        role="tab"
        aria-selected={allIsActive}
        onClick={handleClick('all')}
        onKeyDown={handleKeyDown('all')}
        className={[
          'flex-shrink-0 px-4 py-2.5 min-h-[44px] rounded-full text-xs font-medium',
          'border transition-all duration-200 outline-none',
          'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-1',
          allIsActive
            ? 'bg-[color:var(--color-accent-rose)] border-[color:var(--color-accent-rose)] text-white shadow-sm'
            : 'bg-white/40 backdrop-blur-md border-white/30 hover:bg-white/60',
        ].join(' ')}
        style={allIsActive ? {} : { color: 'var(--color-text-secondary)' }}
      >
        {t.library.allCategory}
      </button>

      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={handleClick(cat.id)}
            onKeyDown={handleKeyDown(cat.id)}
            className={[
              'flex-shrink-0 px-4 py-2.5 min-h-[44px] rounded-full text-xs font-medium',
              'border transition-all duration-200 outline-none',
              'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-1',
              isActive
                ? 'bg-[color:var(--color-accent-rose)] border-[color:var(--color-accent-rose)] text-white shadow-sm'
                : 'bg-white/40 backdrop-blur-md border-white/30 hover:bg-white/60',
            ].join(' ')}
            style={isActive ? {} : { color: 'var(--color-text-secondary)' }}
          >
            {lang === 'ja' ? cat.labelJa : cat.label}
          </button>
        );
      })}
    </div>
  );
}
