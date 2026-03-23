import { useCallback } from 'react';

import { usePlayerStore } from '../../stores/usePlayerStore';
import { useMidiStore } from '../../stores/useMidiStore';
import { SeekBar } from './SeekBar';
import { LoopControl } from './LoopControl';

export function PlayerControl(): React.JSX.Element {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const stop = usePlayerStore((s) => s.stop);
  const hasMidi = useMidiStore((s) => s.parsedMidi !== null);

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

      {/* Transport buttons */}
      <div className="flex items-center justify-center gap-6">
        {/* Stop button (glass) */}
        <button
          type="button"
          onClick={handleStop}
          disabled={!hasMidi}
          aria-label="Stop"
          className={[
            'w-10 h-10 rounded-full flex items-center justify-center',
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
          disabled={!hasMidi}
          aria-label={isPlaying ? 'Pause' : 'Play'}
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
          <span aria-hidden="true">{isPlaying ? '⏸' : '▶'}</span>
        </button>
      </div>
    </div>
  );
}
