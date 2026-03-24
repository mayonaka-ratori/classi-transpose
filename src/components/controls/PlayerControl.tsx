import { useCallback } from 'react';

import { usePlayerStore } from '../../stores/usePlayerStore';
import { useMidiStore } from '../../stores/useMidiStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { useTranslation } from '../../i18n';
import { SeekBar } from './SeekBar';
import { LoopControl } from './LoopControl';

// ── SF loading progress panel ─────────────────────────────────────────────────

function SfLoadingPanel(): React.JSX.Element {
  const sfLoadState = useAudioStore((s) => s.sfLoadState);
  const sfLoadProgress = useAudioStore((s) => s.sfLoadProgress);
  const sfError = useAudioStore((s) => s.sfError);
  const clearError = useAudioStore((s) => s.clearError);
  const loadSoundFont = useAudioStore((s) => s.loadSoundFont);
  const { t } = useTranslation();

  if (sfLoadState === 'loaded' || sfLoadState === 'idle') return <></>;

  if (sfLoadState === 'error') {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-2 w-full py-3 px-4 rounded-xl"
        style={{ background: 'rgba(194,24,91,0.08)', border: '1px solid rgba(194,24,91,0.2)' }}
      >
        <p
          className="text-sm text-center leading-snug"
          style={{ color: 'var(--color-accent-rose)' }}
        >
          {t.player.sfError}
        </p>
        {sfError && (
          <p className="text-xs text-center opacity-70" style={{ color: 'var(--color-accent-rose)' }}>
            {sfError}
          </p>
        )}
        <button
          type="button"
          onClick={() => { clearError(); void loadSoundFont(); }}
          className={[
            'px-4 py-1.5 rounded-full text-xs font-semibold text-white',
            'transition-all duration-200 hover:scale-105 active:scale-95',
            'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50',
          ].join(' ')}
          style={{ background: 'linear-gradient(135deg, #C2185B, #AD1457)' }}
        >
          {t.player.sfRetry}
        </button>
      </div>
    );
  }

  // sfLoadState === 'loading'
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <p
        className="text-sm font-medium"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {t.player.sfLoading(sfLoadProgress)}
      </p>
      <div
        role="progressbar"
        aria-valuenow={sfLoadProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t.player.sfProgressAriaLabel}
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${sfLoadProgress}%`,
            background: 'linear-gradient(90deg, #5C6BC0, #3F51B5)',
          }}
        />
      </div>
    </div>
  );
}

// ── PlayerControl ─────────────────────────────────────────────────────────────

export function PlayerControl(): React.JSX.Element {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const stop = usePlayerStore((s) => s.stop);
  const hasMidi = useMidiStore((s) => s.parsedMidi !== null);
  const sfLoadState = useAudioStore((s) => s.sfLoadState);

  const isLoadingSF = sfLoadState === 'loading';
  const { t } = useTranslation();

  const handlePlayPause = useCallback((): void => {
    if (isPlaying) {
      pause();
    } else {
      void play();
    }
  }, [isPlaying, play, pause]);

  const handleStop = useCallback((): void => {
    stop();
  }, [stop]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Seek bar */}
      <SeekBar />

      {/* A-B loop control */}
      <LoopControl />

      {/* SF loading indicator (visible while downloading or on error) */}
      <SfLoadingPanel />

      {/* Transport buttons */}
      <div className="flex items-center justify-center gap-6">
        {/* Stop button (glass) */}
        <button
          type="button"
          onClick={handleStop}
          disabled={!hasMidi || isLoadingSF}
          aria-label={t.player.stop}
          className={[
            'w-11 h-11 rounded-full flex items-center justify-center',
            'bg-white/40 backdrop-blur-md border border-white/30',
            'transition-all duration-200',
            'hover:bg-white/60 hover:scale-105 active:scale-95',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-2',
          ].join(' ')}
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <span aria-hidden="true" className="text-sm">⏹</span>
        </button>

        {/* Play / Pause button — rose gradient, large circle */}
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={!hasMidi || isLoadingSF}
          aria-label={isPlaying ? t.player.pause : t.player.play}
          className={[
            'w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center',
            'text-white text-xl font-bold',
            'transition-all duration-200',
            'hover:scale-105 active:scale-95',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-2',
            isPlaying ? 'animate-pulse-glow' : '',
          ].join(' ')}
          style={{
            background: 'linear-gradient(135deg, #C2185B, #AD1457)',
            boxShadow: '0 4px 16px rgba(194, 24, 91, 0.35)',
          }}
        >
          <span aria-hidden="true">
            {isLoadingSF ? (
              <svg
                width="20"
                height="20"
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
            ) : isPlaying ? '⏸' : '▶'}
          </span>
        </button>
      </div>
    </div>
  );
}
