import { useCallback } from 'react';

import { usePlayerStore } from '../../stores/usePlayerStore';
import { useMidiStore } from '../../stores/useMidiStore';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SeekBar(): React.JSX.Element {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const loopEnabled = usePlayerStore((s) => s.loopEnabled);
  const loopStart = usePlayerStore((s) => s.loopStart);
  const loopEnd = usePlayerStore((s) => s.loopEnd);
  const seek = usePlayerStore((s) => s.seek);
  const hasMidi = useMidiStore((s) => s.parsedMidi !== null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      seek(parseFloat(e.target.value));
    },
    [seek],
  );

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const loopStartPct = duration > 0 ? (loopStart / duration) * 100 : 0;
  const loopEndPct = duration > 0 ? (loopEnd / duration) * 100 : 0;
  const showLoop = loopEnabled && loopEnd > loopStart && duration > 0;

  return (
    /* Minimum 44px touch target via py-3 wrapper */
    <div className="flex items-center gap-3 w-full py-3">
      {/* Elapsed time */}
      <span
        className="shrink-0 w-12 text-right text-xs tabular-nums"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
      >
        {formatTime(currentTime)}
      </span>

      {/* Track + thumb */}
      <div className="relative flex-1 flex items-center" style={{ minHeight: '44px' }}>
        {/* Gradient progress fill */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full pointer-events-none"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #C2185B, #E91E63)',
          }}
        />

        {/* Loop region highlight */}
        {showLoop && (
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full pointer-events-none"
            style={{
              left: `${loopStartPct}%`,
              width: `${loopEndPct - loopStartPct}%`,
              backgroundColor: 'rgba(194, 24, 91, 0.25)',
            }}
          />
        )}

        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={currentTime}
          onChange={handleChange}
          disabled={!hasMidi}
          aria-label="Seek playback position"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          className="slider-rose w-full relative z-10"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Total time */}
      <span
        className="shrink-0 w-12 text-xs tabular-nums"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
      >
        {formatTime(duration)}
      </span>
    </div>
  );
}
