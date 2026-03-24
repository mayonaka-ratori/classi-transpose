import { useCallback, useState, useEffect } from 'react';

import { usePlayerStore } from '../../stores/usePlayerStore';
import { MIN_TEMPO_SCALE, MAX_TEMPO_SCALE, MAX_BPM } from '../../utils/constants';

const MIN_BPM = 1;

export function BpmControl(): React.JSX.Element {
  const originalBpm = usePlayerStore((s) => s.originalBpm);
  const tempoScale = usePlayerStore((s) => s.tempoScale);
  const setTempoScale = usePlayerStore((s) => s.setTempoScale);

  const currentBpm = Math.round(originalBpm * tempoScale);
  const percentLabel = `${Math.round(tempoScale * 100)}%`;

  // Dynamic slider max: cap so result never exceeds MAX_BPM (320)
  const sliderMax =
    originalBpm > 0
      ? Math.min(MAX_TEMPO_SCALE, MAX_BPM / originalBpm)
      : MAX_TEMPO_SCALE;

  const [inputValue, setInputValue] = useState(String(currentBpm));

  useEffect(() => {
    setInputValue(String(currentBpm));
  }, [currentBpm]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setTempoScale(parseFloat(e.target.value));
  }, [setTempoScale]);

  const commitBpm = useCallback((raw: string): void => {
    const bpm = parseInt(raw, 10);
    if (Number.isNaN(bpm) || bpm < MIN_BPM || bpm > MAX_BPM || originalBpm === 0) return;
    setTempoScale(bpm / originalBpm);
  }, [originalBpm, setTempoScale]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  }, []);

  const handleInputBlur = useCallback((): void => {
    commitBpm(inputValue);
  }, [commitBpm, inputValue]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') commitBpm(inputValue);
    if (e.key === 'Escape') setInputValue(String(currentBpm));
  }, [commitBpm, currentBpm, inputValue]);

  const handleReset = useCallback((): void => {
    setTempoScale(1.0);
  }, [setTempoScale]);

  return (
    <div className="flex flex-col gap-4">
      {/* Section label */}
      <h2
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Tempo
      </h2>

      {/* Large BPM display */}
      <div className="flex items-baseline gap-2">
        <span
          className="text-[40px] font-medium leading-none tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-on-glass)' }}
        >
          {currentBpm}
        </span>
        <span
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          BPM
        </span>
      </div>

      {/* Percentage + original + max indicator */}
      <p
        className="text-sm -mt-2 tabular-nums"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-teal)' }}
      >
        {percentLabel} (×{tempoScale.toFixed(2)})
        <span
          className="ml-2 text-xs"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-tertiary)' }}
        >
          original {Math.round(originalBpm)} BPM · max {MAX_BPM}
        </span>
      </p>

      {/* Teal gradient slider — max is dynamic to enforce MAX_BPM cap */}
      <input
        type="range"
        min={MIN_TEMPO_SCALE}
        max={sliderMax}
        step={0.01}
        value={tempoScale}
        onChange={handleSliderChange}
        aria-label="Tempo scale"
        aria-valuemin={MIN_TEMPO_SCALE}
        aria-valuemax={sliderMax}
        aria-valuenow={tempoScale}
        className="slider-teal"
      />

      {/* Numeric BPM input + reset */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 flex-1">
          <label htmlFor="bpm-input" className="sr-only">BPM</label>
          <input
            id="bpm-input"
            type="number"
            min={MIN_BPM}
            max={MAX_BPM}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            aria-label="BPM value"
            className={[
              'w-24 px-3 py-2.5 rounded-xl text-sm text-right tabular-nums',
              'bg-white/40 backdrop-blur-md border border-white/30',
              'focus:outline-none focus-visible:ring-2',
              'focus-visible:ring-[color:var(--color-accent-rose)]/50',
              'transition-all duration-200',
            ].join(' ')}
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-on-glass)' }}
          />
          <span
            className="text-xs"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            BPM
          </span>
        </div>

        {/* Reset pill button */}
        <button
          type="button"
          onClick={handleReset}
          disabled={tempoScale === 1.0}
          aria-label="Reset tempo to original"
          className={[
            'px-4 py-2.5 rounded-full text-xs font-semibold',
            'bg-white/40 backdrop-blur-md border border-white/30',
            'transition-all duration-200',
            'hover:bg-white/60 hover:border-white/50',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-2',
          ].join(' ')}
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
