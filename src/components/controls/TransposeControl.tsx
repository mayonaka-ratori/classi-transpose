import { useCallback } from 'react';

import { useTranspose } from '../../hooks/useTranspose';
import { MAX_TRANSPOSE_SEMITONES, MIN_TRANSPOSE_SEMITONES } from '../../utils/constants';
import type { KeyName } from '../../types/music';

export function TransposeControl(): React.JSX.Element {
  const { semitones, currentKey, allKeys, increment, decrement, setByKey, setSemitones } = useTranspose();

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSemitones(parseInt(e.target.value, 10));
  }, [setSemitones]);

  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    setByKey(e.target.value as KeyName);
  }, [setByKey]);

  const sign = semitones > 0 ? '+' : '';
  const semitoneLabel =
    semitones === 0
      ? 'no change'
      : `${sign}${semitones} semitone${Math.abs(semitones) !== 1 ? 's' : ''}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Section label */}
      <h2
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Transpose
      </h2>

      {/* Large semitone value display */}
      <div className="flex items-baseline gap-2">
        <span
          className="text-[40px] font-semibold leading-none tabular-nums animate-key-change"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
        >
          {sign}{semitones}
        </span>
        <span
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {semitones === 0 ? 'semitones (no change)' : `semitone${Math.abs(semitones) !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Key name display */}
      {currentKey && (
        <p
          className="text-base italic -mt-2"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-accent-indigo)' }}
        >
          {currentKey.label}
        </p>
      )}

      {/* Key dropdown */}
      {allKeys.length > 0 && currentKey && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="key-select"
            className="text-xs font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Target key
          </label>
          <select
            id="key-select"
            value={currentKey.name}
            onChange={handleSelectChange}
            className={[
              'w-full px-3 py-2 rounded-xl text-sm cursor-pointer',
              'bg-white/40 backdrop-blur-md border border-white/30',
              'focus:outline-none focus-visible:ring-2',
              'focus-visible:ring-[color:var(--color-accent-rose)]/50',
              'transition-all duration-200 hover:bg-white/60',
            ].join(' ')}
            style={{ color: 'var(--color-text-on-glass)' }}
          >
            {allKeys.map((k) => (
              <option key={k.name} value={k.name}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Slider row */}
      <div className="flex items-center gap-3">
        {/* − button */}
        <button
          type="button"
          onClick={decrement}
          disabled={semitones <= MIN_TRANSPOSE_SEMITONES}
          aria-label="Transpose down 1 semitone"
          className={[
            'w-9 h-9 rounded-full shrink-0 flex items-center justify-center',
            'bg-white/40 backdrop-blur-md border border-white/30',
            'text-lg font-bold',
            'transition-all duration-200',
            'hover:bg-white/60 hover:scale-110 active:scale-95',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-2',
          ].join(' ')}
          style={{ color: 'var(--color-accent-indigo)' }}
        >
          −
        </button>

        <input
          type="range"
          min={MIN_TRANSPOSE_SEMITONES}
          max={MAX_TRANSPOSE_SEMITONES}
          step={1}
          value={semitones}
          onChange={handleSliderChange}
          aria-label="Semitone offset"
          aria-valuemin={MIN_TRANSPOSE_SEMITONES}
          aria-valuemax={MAX_TRANSPOSE_SEMITONES}
          aria-valuenow={semitones}
          className="slider-indigo flex-1"
        />

        {/* + button */}
        <button
          type="button"
          onClick={increment}
          disabled={semitones >= MAX_TRANSPOSE_SEMITONES}
          aria-label="Transpose up 1 semitone"
          className={[
            'w-9 h-9 rounded-full shrink-0 flex items-center justify-center',
            'bg-white/40 backdrop-blur-md border border-white/30',
            'text-lg font-bold',
            'transition-all duration-200',
            'hover:bg-white/60 hover:scale-110 active:scale-95',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-2',
          ].join(' ')}
          style={{ color: 'var(--color-accent-indigo)' }}
        >
          +
        </button>
      </div>

      {/* Semitone label */}
      <p
        className="text-xs text-center"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {semitoneLabel}
      </p>
    </div>
  );
}
