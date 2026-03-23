import { useCallback } from 'react';

import { useAudioStore } from '../../stores/useAudioStore';

// ── Progress bar ──────────────────────────────────────────────────────────────

type ProgressBarProps = {
  pct: number;
};

function ProgressBar({ pct }: ProgressBarProps): React.JSX.Element {
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="SoundFont download progress"
      className="w-full h-1.5 rounded-full overflow-hidden"
      style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--color-accent-indigo), #3F51B5)',
        }}
      />
    </div>
  );
}

// ── QualityToggle ─────────────────────────────────────────────────────────────

/**
 * Compact glass-pill toggle between Standard (no SoundFont) and HQ (SF2 loaded).
 * Designed for the app Header right slot.
 */
export function QualityToggle(): React.JSX.Element {
  const quality = useAudioStore((s) => s.quality);
  const sfLoadState = useAudioStore((s) => s.sfLoadState);
  const sfLoadProgress = useAudioStore((s) => s.sfLoadProgress);
  const sfError = useAudioStore((s) => s.sfError);
  const enableHQ = useAudioStore((s) => s.enableHQ);
  const enableStandard = useAudioStore((s) => s.enableStandard);

  const isLoading = sfLoadState === 'loading';

  const handleStandard = useCallback((): void => {
    if (!isLoading) enableStandard();
  }, [enableStandard, isLoading]);

  const handleHQ = useCallback((): void => {
    if (!isLoading) void enableHQ();
  }, [enableHQ, isLoading]);

  return (
    <div className="flex flex-col items-end gap-1">
      {/* Pill toggle row */}
      <div
        className={[
          'flex items-center',
          'bg-white/35 backdrop-blur-md border border-white/25 rounded-full',
          'p-0.5',
        ].join(' ')}
        role="group"
        aria-label="Audio quality"
      >
        {/* Standard button */}
        <button
          type="button"
          onClick={handleStandard}
          disabled={isLoading}
          aria-pressed={quality === 'standard'}
          aria-label="Standard quality (no SoundFont)"
          className={[
            'px-3 py-1 rounded-full text-xs font-semibold',
            'transition-all duration-200',
            'disabled:cursor-not-allowed',
            quality === 'standard'
              ? 'text-white shadow-sm'
              : 'hover:bg-white/30',
            'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-indigo)]/50',
          ].join(' ')}
          style={
            quality === 'standard'
              ? {
                  background: 'linear-gradient(135deg, #5C6BC0, #3F51B5)',
                  color: '#fff',
                }
              : { color: 'var(--color-text-secondary)' }
          }
        >
          🎵 Standard
        </button>

        {/* HQ button */}
        <button
          type="button"
          onClick={handleHQ}
          disabled={isLoading}
          aria-pressed={quality === 'hq'}
          aria-label="High quality (SoundFont loaded)"
          className={[
            'px-3 py-1 rounded-full text-xs font-semibold',
            'transition-all duration-200',
            'disabled:cursor-not-allowed',
            quality === 'hq'
              ? 'text-white shadow-sm'
              : 'hover:bg-white/30',
            'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-indigo)]/50',
          ].join(' ')}
          style={
            quality === 'hq'
              ? {
                  background: 'linear-gradient(135deg, #5C6BC0, #3F51B5)',
                  color: '#fff',
                }
              : { color: 'var(--color-text-secondary)' }
          }
        >
          {isLoading ? (
            // Inline spinner while loading
            <span className="flex items-center gap-1.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                className="animate-spin"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Loading…
            </span>
          ) : (
            '🎹 HQ'
          )}
        </button>
      </div>

      {/* Download progress bar — visible only while loading */}
      {isLoading && (
        <div className="w-full min-w-[140px]">
          <ProgressBar pct={sfLoadProgress} />
          <p
            className="text-[10px] text-right mt-0.5 tabular-nums"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {sfLoadProgress}%
          </p>
        </div>
      )}

      {/* Error notice — auto-dismissed on next Standard click */}
      {sfLoadState === 'error' && sfError !== null && (
        <p
          role="alert"
          className="text-[10px] max-w-[200px] text-right leading-snug"
          style={{ color: 'var(--color-accent-rose)' }}
        >
          {sfError}
        </p>
      )}
    </div>
  );
}
