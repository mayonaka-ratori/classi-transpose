import { useState, useCallback } from 'react';

import { usePlayerStore } from '../../stores/usePlayerStore';
import { useMidiStore } from '../../stores/useMidiStore';
import { useTranslation } from '../../i18n';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function LoopControl(): React.JSX.Element {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const loopEnabled = usePlayerStore((s) => s.loopEnabled);
  const loopStart = usePlayerStore((s) => s.loopStart);
  const loopEnd = usePlayerStore((s) => s.loopEnd);
  const setLoop = usePlayerStore((s) => s.setLoop);
  const clearLoop = usePlayerStore((s) => s.clearLoop);
  const hasMidi = useMidiStore((s) => s.parsedMidi !== null);

  const [pendingA, setPendingA] = useState<number | null>(null);

  const isLoopActive = loopEnabled && loopEnd > loopStart;
  const hasA = pendingA !== null || isLoopActive;

  const handleA = useCallback((): void => {
    if (isLoopActive || pendingA !== null) {
      clearLoop();
      setPendingA(null);
    } else {
      setPendingA(currentTime);
    }
  }, [isLoopActive, pendingA, currentTime, clearLoop]);

  const handleB = useCallback((): void => {
    if (isLoopActive) {
      clearLoop();
      setPendingA(null);
      return;
    }
    if (pendingA !== null && currentTime > pendingA) {
      setLoop(pendingA, currentTime);
      setPendingA(null);
    }
  }, [isLoopActive, pendingA, currentTime, setLoop, clearLoop]);

  const handleClear = useCallback((): void => {
    clearLoop();
    setPendingA(null);
  }, [clearLoop]);

  const displayA = isLoopActive ? loopStart : (pendingA ?? null);
  const displayB = isLoopActive ? loopEnd : null;
  const { t } = useTranslation();

  /* Shared glass pill button base classes */
  const pillBase = [
    'px-4 py-2.5 min-h-[44px] rounded-full text-sm font-semibold',
    'flex items-center justify-center',
    'border transition-all duration-200',
    'focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' ');

  const pillInactive = [
    'bg-white/40 backdrop-blur-md border-white/30',
    'text-[color:var(--color-text-secondary)]',
    'hover:bg-white/60 hover:border-white/50',
    'focus-visible:ring-[color:var(--color-accent-rose)]/50',
  ].join(' ');

  const pillActive = [
    'border-[color:var(--color-accent-rose)]/40',
    'text-[color:var(--color-accent-rose)] font-bold',
    'focus-visible:ring-[color:var(--color-accent-rose)]/50',
  ].join(' ');

  return (
    <div className="flex flex-col gap-2">
      <h3
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {t.loop.label}
      </h3>

      <div className="flex items-center gap-2 flex-wrap">
        {/* A button */}
        <button
          type="button"
          onClick={handleA}
          disabled={!hasMidi}
          aria-label={t.loop.setA}
          aria-pressed={hasA}
          className={[
            pillBase,
            hasA ? pillActive : pillInactive,
            hasA ? 'bg-[color:var(--color-accent-rose-light)]' : '',
          ].join(' ')}
        >
          A
        </button>

        {/* B button */}
        <button
          type="button"
          onClick={handleB}
          disabled={!hasMidi || (!isLoopActive && pendingA === null)}
          aria-label={t.loop.setB}
          aria-pressed={isLoopActive}
          className={[
            pillBase,
            isLoopActive ? pillActive : pillInactive,
            isLoopActive ? 'bg-[color:var(--color-accent-rose-light)]' : '',
          ].join(' ')}
        >
          B
        </button>

        {/* Time display */}
        <span
          className="text-xs flex-1 tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
        >
          {displayA !== null && (
            <>
              <span style={{ color: 'var(--color-text-secondary)' }}>{formatTime(displayA)}</span>
              {displayB !== null && (
                <> → <span style={{ color: 'var(--color-text-secondary)' }}>{formatTime(displayB)}</span></>
              )}
              {displayB === null && pendingA !== null && (
                <span style={{ color: 'var(--color-text-tertiary)' }}> → ?</span>
              )}
            </>
          )}
        </span>

        {/* Clear button */}
        {(isLoopActive || pendingA !== null) && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t.loop.clearAriaLabel}
            className={[
              'px-3 py-2 rounded-full text-xs border',
              'bg-white/30 backdrop-blur-md border-white/30',
              'hover:bg-white/50 hover:border-white/50',
              'transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-2',
            ].join(' ')}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t.loop.clear}
          </button>
        )}
      </div>

      {/* Status text */}
      {isLoopActive && (
        <p className="text-xs font-medium" style={{ color: 'var(--color-accent-rose)' }}>
          {t.loop.activeStatus(formatTime(loopStart), formatTime(loopEnd))}
        </p>
      )}
      {pendingA !== null && !isLoopActive && (
        <p className="text-xs" style={{ color: 'var(--color-accent-gold)' }}>
          {t.loop.pendingA(formatTime(pendingA))}
        </p>
      )}
    </div>
  );
}
