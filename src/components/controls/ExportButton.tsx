import { useState, useCallback } from 'react';

import { useMidiStore } from '../../stores/useMidiStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useTranslation } from '../../i18n';
import { buildExportedMidi, buildExportFileName } from '../../utils/midi-export';

// ── Download icon (SVG) ───────────────────────────────────────────────────────

function DownloadIcon(): React.JSX.Element {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
      <path d="M4 20h16" />
    </svg>
  );
}

// ── Spinner icon ──────────────────────────────────────────────────────────────

function SpinnerIcon(): React.JSX.Element {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

// ── ExportButton ──────────────────────────────────────────────────────────────

type ExportButtonProps = {
  /** When true, renders a compact icon-only button suitable for the app header. */
  compact?: boolean;
};

/**
 * MIDI export button.
 *
 * Reads the current transpose + BPM from stores, builds a modified MIDI binary,
 * and triggers a browser download.
 *
 * - `compact=false` (default): full-width green gradient button with label.
 * - `compact=true`: small glass icon button for placement in the header.
 */
export function ExportButton({ compact = false }: ExportButtonProps): React.JSX.Element {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Store slices — subscribe to minimum required state
  const rawMidiData = useMidiStore((s) => s.rawMidiData);
  const fileName = useMidiStore((s) => s.fileName);
  const transposeSemitones = useMidiStore((s) => s.transposeSemitones);
  const originalBpm = usePlayerStore((s) => s.originalBpm);
  const tempoScale = usePlayerStore((s) => s.tempoScale);

  const hasFile = rawMidiData !== null;
  const { t } = useTranslation();

  const handleExport = useCallback((): void => {
    if (!rawMidiData || isExporting) return;

    setIsExporting(true);
    setExportError(null);

    // Use setTimeout to yield to the browser so the spinner renders before
    // the (potentially heavy) MIDI processing blocks the main thread.
    setTimeout(() => {
      try {
        const outputBuffer = buildExportedMidi(rawMidiData, {
          transposeSemitones,
          tempoScale,
        });

        const targetBpm = originalBpm * tempoScale;
        const downloadName = buildExportFileName(fileName, transposeSemitones, targetBpm);

        const blob = new Blob([outputBuffer], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = downloadName;
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        // Revoke the object URL after a short delay to allow the download to start
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        setExportError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t.export.error;
        setExportError(message);
      } finally {
        setIsExporting(false);
      }
    }, 0);
  }, [rawMidiData, isExporting, transposeSemitones, tempoScale, originalBpm, fileName, t]);

  // ── Compact mode (header icon button) ────────────────────────────────────────
  if (compact) {
    return (
      <button
        type="button"
        onClick={handleExport}
        disabled={!hasFile || isExporting}
        aria-label={isExporting ? t.export.exportingAriaLabel : t.export.headerAriaLabel}
        aria-busy={isExporting}
        className={[
          'w-10 h-10 flex items-center justify-center rounded-xl',
          'bg-white/40 backdrop-blur-md border border-white/30',
          'transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-green)]/50 focus-visible:ring-offset-2',
          hasFile && !isExporting
            ? 'hover:bg-white/60 hover:scale-105 active:scale-95 cursor-pointer'
            : 'opacity-40 cursor-not-allowed',
        ].join(' ')}
        style={{ color: hasFile ? 'var(--color-accent-green)' : 'var(--color-text-tertiary)' }}
      >
        {isExporting ? <SpinnerIcon /> : <DownloadIcon />}
      </button>
    );
  }

  // ── Full mode (green gradient button) ─────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Section label */}
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}
      >
        {t.export.label}
      </p>

      {/* Export button — green gradient per design-system.md */}
      <button
        type="button"
        onClick={handleExport}
        disabled={!hasFile || isExporting}
        aria-label={isExporting ? t.export.exportingAriaLabel : t.export.exportAriaLabel}
        aria-busy={isExporting}
        className={[
          'w-full py-3 flex items-center justify-center gap-2',
          'text-white font-semibold text-sm rounded-xl',
          'transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-green)]/50 focus-visible:ring-offset-2',
          hasFile && !isExporting
            ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
            : 'opacity-50 cursor-not-allowed',
        ].join(' ')}
        style={{
          background: hasFile
            ? 'linear-gradient(90deg, #2E7D32, #388E3C)'
            : 'linear-gradient(90deg, #2E7D32, #388E3C)',
          boxShadow: hasFile && !isExporting
            ? '0 4px 16px rgba(46, 125, 50, 0.30)'
            : 'none',
        }}
      >
        {isExporting ? <SpinnerIcon /> : <DownloadIcon />}
        <span>{isExporting ? t.export.exporting : t.export.button}</span>
      </button>

      {/* Inline error message */}
      {exportError !== null && (
        <p
          role="alert"
          className="text-xs px-1"
          style={{ color: 'var(--color-accent-rose)' }}
        >
          {exportError}
        </p>
      )}
    </div>
  );
}
