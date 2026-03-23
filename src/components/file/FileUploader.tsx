import { useCallback, useRef, useState } from 'react';

import { useMidiStore } from '../../stores/useMidiStore';
import { readFileAsArrayBuffer } from '../../utils/file-helpers';

export function FileUploader(): React.JSX.Element {
  const loadFile = useMidiStore((s) => s.loadFile);
  const setLoadError = useMidiStore((s) => s.setLoadError);
  const isLoading = useMidiStore((s) => s.isLoading);
  const loadError = useMidiStore((s) => s.loadError);
  const fileName = useMidiStore((s) => s.fileName);

  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File): Promise<void> => {
    if (!file.name.toLowerCase().endsWith('.mid') && !file.name.toLowerCase().endsWith('.midi')) {
      setLoadError('Please select a .mid or .midi file.');
      return;
    }
    try {
      const buffer = await readFileAsArrayBuffer(file);
      await loadFile(buffer, file.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read file';
      setLoadError(message);
    }
  }, [loadFile, setLoadError]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((): void => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  const handleClick = useCallback((): void => {
    inputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Select or drop a MIDI file"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'flex flex-col items-center justify-center gap-3',
          'border-2 border-dashed rounded-3xl px-6 py-8 cursor-pointer',
          'transition-all duration-200 outline-none',
          'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-2',
          isDragging
            ? 'border-[color:var(--color-accent-gold)] bg-white/45 scale-[1.01]'
            : 'border-[color:var(--color-accent-gold)]/30 bg-white/20 hover:border-[color:var(--color-accent-gold)]/60 hover:bg-white/35',
        ].join(' ')}
      >
        {/* Music note icon with gold gradient background */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-gold-light), rgba(184,134,11,0.20))',
            border: '1px solid rgba(184,134,11,0.25)',
          }}
          aria-hidden="true"
        >
          🎵
        </div>

        {isLoading ? (
          <span
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Loading…
          </span>
        ) : fileName ? (
          <span
            className="text-sm font-semibold truncate max-w-full px-4 text-center"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
          >
            {fileName}
          </span>
        ) : (
          <>
            <span
              className="text-base font-semibold text-center"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
            >
              Drop your MIDI file here
            </span>
            <span
              className="text-xs text-center"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              or click to browse (.mid / .midi)
            </span>
          </>
        )}
      </div>

      {loadError && (
        <p
          role="alert"
          className="mt-2 text-xs px-1"
          style={{ color: '#C62828' }}
        >
          {loadError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".mid,.midi"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleInputChange}
      />
    </div>
  );
}
