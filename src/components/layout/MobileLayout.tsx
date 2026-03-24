import { useState, useCallback } from 'react';

import { useMidiPlayer } from '../../hooks/useMidiPlayer';
import { useMidiStore } from '../../stores/useMidiStore';

import { AmbientBackground } from './AmbientBackground';
import { FileUploader } from '../file/FileUploader';
import { PlayerControl } from '../controls/PlayerControl';
import { TransposeControl } from '../controls/TransposeControl';
import { BpmControl } from '../controls/BpmControl';
import { ExportButton } from '../controls/ExportButton';
import { TrackList } from '../tracks/TrackList';
import { MidiLibrary } from '../library/MidiLibrary';

/** Shared glass card classes — standard variant */
const GLASS_CARD = [
  'bg-white/55 backdrop-blur-xl backdrop-saturate-[180%]',
  'border border-white/30 rounded-2xl',
  'shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)]',
  'transition-all duration-300',
  'hover:bg-white/65 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]',
  'p-5 md:p-6',
].join(' ');

/** Elevated glass card — for song info / playback */
const GLASS_CARD_ELEVATED = [
  'bg-white/65 backdrop-blur-2xl backdrop-saturate-[180%]',
  'border border-white/30 rounded-2xl',
  'shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)]',
  'transition-all duration-300',
  'p-5 md:p-6',
].join(' ');

function SongInfoCard(): React.JSX.Element {
  const parsedMidi = useMidiStore((s) => s.parsedMidi);
  const fileName = useMidiStore((s) => s.fileName);
  const originalKeySignature = useMidiStore((s) => s.originalKeySignature);

  if (!parsedMidi) return <></>;

  // Extract title / composer from fileName if formatted "Title — Composer"
  const [title, composer] = fileName.includes(' — ')
    ? fileName.split(' — ')
    : [fileName, ''];

  return (
    <section
      aria-label="Song information"
      className={`${GLASS_CARD_ELEVATED} animate-card-enter stagger-1`}
    >
      {/* Title */}
      <p
        className="text-xl md:text-2xl font-semibold leading-snug line-clamp-2"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
      >
        {title || fileName}
      </p>

      {/* Composer (italic serif) */}
      {composer && (
        <p
          className="text-sm italic mt-0.5"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-secondary)' }}
        >
          {composer}
        </p>
      )}

      {/* Metadata pills */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span
          className="px-2 py-0.5 rounded-full text-xs font-medium border"
          style={{
            backgroundColor: 'var(--color-accent-indigo-light)',
            borderColor: 'var(--color-accent-indigo)',
            color: 'var(--color-accent-indigo)',
          }}
        >
          {parsedMidi.tracks.length} track{parsedMidi.tracks.length !== 1 ? 's' : ''}
        </span>

        {originalKeySignature && (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium border"
            style={{
              backgroundColor: 'var(--color-accent-gold-light)',
              borderColor: 'var(--color-accent-gold)',
              color: 'var(--color-accent-gold)',
            }}
          >
            {originalKeySignature.key} {originalKeySignature.mode}
          </span>
        )}
      </div>
    </section>
  );
}

/**
 * Collapsible MIDI Library panel — shown in song-loaded state on mobile.
 * On desktop it is always expanded in the left column.
 */
function CollapsibleLibrary(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <section
      aria-label="MIDI library"
      className={`${GLASS_CARD} animate-card-enter stagger-4`}
    >
      {/* Toggle header — visible on mobile, hidden on lg */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="library-panel"
        onClick={toggle}
        className={[
          'lg:hidden w-full min-h-[44px] flex items-center justify-between gap-2',
          'outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50',
        ].join(' ')}
      >
        <span
          className="text-sm font-semibold"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
        >
          MIDI Library
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Panel — shown on lg always, on mobile only when open */}
      <div
        id="library-panel"
        className={`${open ? 'mt-4' : 'hidden'} lg:block lg:mt-0`}
      >
        <MidiLibrary />
      </div>
    </section>
  );
}

export function MobileLayout(): React.JSX.Element {
  useMidiPlayer();

  const parsedMidi = useMidiStore((s) => s.parsedMidi);

  if (!parsedMidi) {
    // ── No song loaded ──────────────────────────────────────────────
    // Full-width library browser is the primary action; FileUploader is secondary
    return (
      <>
        <AmbientBackground />
        <div className="flex flex-col gap-4 pb-[calc(2rem+env(safe-area-inset-bottom))] lg:grid lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-5">

          {/* Left: Library (prominent) + FileUploader (secondary) */}
          <div className="flex flex-col gap-4">
            <section
              aria-label="MIDI library"
              className={`${GLASS_CARD} animate-card-enter stagger-1`}
            >
              <MidiLibrary />
            </section>

            {/* Secondary: drop your own file */}
            <section
              aria-label="Upload your own MIDI file"
              className={`${GLASS_CARD} animate-card-enter stagger-2`}
            >
              <p
                className="text-xs mb-3"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Or upload your own .mid file:
              </p>
              <FileUploader />
            </section>
          </div>

          {/* Right: placeholder on desktop */}
          <div className="hidden lg:flex flex-col gap-4">
            <div
              className={`${GLASS_CARD} opacity-40`}
              style={{ minHeight: '160px' }}
            >
              <p
                className="text-sm text-center pt-8"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-tertiary)' }}
              >
                Select a piece from the library to start playing.
              </p>
            </div>
          </div>

        </div>
      </>
    );
  }

  // ── Song loaded ──────────────────────────────────────────────────
  // Desktop: library on left, controls on right
  // Mobile: controls stacked, then collapsible library at bottom
  return (
    <>
      <AmbientBackground />

      {/*
        Mobile: single column (default)
        Desktop lg+: two-column grid
          Left col  40% → library browser
          Right col 60% → song info + controls
      */}
      <div className="flex flex-col gap-4 pb-[calc(2rem+env(safe-area-inset-bottom))] lg:grid lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-5">

        {/* ── LEFT COLUMN (desktop) / bottom (mobile) ─────────────── */}
        <div className="flex flex-col gap-4 order-last lg:order-first">

          {/* MIDI Library — always visible on desktop; collapsible on mobile */}
          <section
            aria-label="MIDI library"
            className={`hidden lg:block ${GLASS_CARD} animate-card-enter stagger-1`}
          >
            <MidiLibrary />
          </section>

          {/* FileUploader — secondary, desktop left column */}
          <section
            aria-label="Upload your own MIDI file"
            className={`hidden lg:block ${GLASS_CARD} animate-card-enter stagger-2`}
          >
            <p
              className="text-xs mb-3"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Or upload your own .mid file:
            </p>
            <FileUploader />
          </section>

        </div>

        {/* ── RIGHT COLUMN (desktop) / top (mobile) ───────────────── */}
        <div className="flex flex-col gap-4">

          {/* Song info */}
          <SongInfoCard />

          {/* Playback controls */}
          <section
            aria-label="Playback controls"
            className={`${GLASS_CARD_ELEVATED} animate-card-enter stagger-2`}
          >
            <PlayerControl />
          </section>

          {/* Transpose */}
          <section
            aria-label="Transpose controls"
            className={`${GLASS_CARD} animate-card-enter stagger-3`}
          >
            <TransposeControl />
          </section>

          {/* BPM */}
          <section
            aria-label="Tempo controls"
            className={`${GLASS_CARD} animate-card-enter stagger-4`}
          >
            <BpmControl />
          </section>

          {/* Track list */}
          <section
            aria-label="Track controls"
            className={`${GLASS_CARD} animate-card-enter stagger-5`}
          >
            <TrackList />
          </section>

          {/* Export */}
          <section
            aria-label="Export controls"
            className={`${GLASS_CARD} animate-card-enter stagger-5`}
          >
            <ExportButton />
          </section>

          {/* Collapsible library + file uploader — mobile only */}
          <div className="lg:hidden flex flex-col gap-4">
            <CollapsibleLibrary />

            <section
              aria-label="Upload your own MIDI file"
              className={`${GLASS_CARD} animate-card-enter stagger-5`}
            >
              <p
                className="text-xs mb-3"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Or upload your own .mid file:
              </p>
              <FileUploader />
            </section>
          </div>

        </div>

      </div>
    </>
  );
}
