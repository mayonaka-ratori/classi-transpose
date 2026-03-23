import { create } from 'zustand';
import { BasicMIDI } from 'spessasynth_core';
import type { MidiData, MidiTrack, KeySignature } from '../types/midi';
import type { MidiPiece } from '../data/midi-catalog';
import { parseMidiFile } from '../engine/midi/parser';
import { setCurrentMidi, applyMuteState } from '../engine/audio/synth-manager';
import { initSequencer } from '../engine/audio/playback-scheduler';

/**
 * Verify that an ArrayBuffer starts with the MIDI magic bytes "MThd" (0x4D 0x54 0x68 0x64).
 * Vite's SPA fallback returns index.html (200 OK) for missing static files, so we must
 * guard against HTML content being passed to the MIDI parser.
 */
function assertMidiMagicBytes(buffer: ArrayBuffer): void {
  if (buffer.byteLength < 4) {
    throw new Error('Not a valid MIDI file (file too small)');
  }
  const view = new Uint8Array(buffer, 0, 4);
  // "MThd" = 0x4D 0x54 0x68 0x64
  if (view[0] !== 0x4D || view[1] !== 0x54 || view[2] !== 0x68 || view[3] !== 0x64) {
    throw new Error('Not a valid MIDI file (invalid header)');
  }
}

type MidiStore = {
  rawMidiData: ArrayBuffer | null;
  parsedMidi: MidiData | null;
  basicMidi: BasicMIDI | null;
  fileName: string;
  currentPiece: MidiPiece | null;
  transposeSemitones: number;
  originalKeySignature: KeySignature | null;
  tracks: MidiTrack[];
  mutedTracks: Set<number>;
  soloTracks: Set<number>;
  isLoading: boolean;
  loadError: string | null;

  loadFile: (buffer: ArrayBuffer, name: string) => Promise<void>;
  loadPreset: (piece: MidiPiece) => Promise<void>;
  setTransposeSemitones: (semitones: number) => void;
  toggleMuteTrack: (trackIndex: number) => void;
  toggleSoloTrack: (trackIndex: number) => void;
  setLoadError: (message: string) => void;
  reset: () => void;
};

export const useMidiStore = create<MidiStore>()((set) => ({
  rawMidiData: null,
  parsedMidi: null,
  basicMidi: null,
  fileName: '',
  currentPiece: null,
  transposeSemitones: 0,
  originalKeySignature: null,
  tracks: [],
  mutedTracks: new Set(),
  soloTracks: new Set(),
  isLoading: false,
  loadError: null,

  loadFile: async (buffer, name) => {
    set({ isLoading: true, loadError: null });
    try {
      assertMidiMagicBytes(buffer);
      const parsed = parseMidiFile(buffer, name);
      const basicMidi = BasicMIDI.fromArrayBuffer(buffer, name);

      setCurrentMidi(basicMidi);
      initSequencer(basicMidi);

      set({
        rawMidiData: buffer,
        parsedMidi: parsed,
        basicMidi,
        fileName: name,
        currentPiece: null,
        originalKeySignature: parsed.keySignature,
        tracks: parsed.tracks,
        transposeSemitones: 0,
        mutedTracks: new Set(),
        soloTracks: new Set(),
        isLoading: false,
        loadError: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load MIDI file';
      set({ isLoading: false, loadError: message });
    }
  },

  loadPreset: async (piece) => {
    set({ isLoading: true, loadError: null });
    try {
      const url = `/presets/${piece.filename}`;
      const displayName = `${piece.title} — ${piece.composerFull}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `MIDI file not found: ${piece.filename}. ` +
          'Download it from the source listed in docs/MIDI_DOWNLOAD_GUIDE.md and place it in public/presets/.',
        );
      }
      const buffer = await response.arrayBuffer();
      // Guard against Vite SPA fallback serving index.html instead of a real MIDI file
      assertMidiMagicBytes(buffer);
      const parsed = parseMidiFile(buffer, displayName);
      const basicMidi = BasicMIDI.fromArrayBuffer(buffer, displayName);

      setCurrentMidi(basicMidi);
      initSequencer(basicMidi);

      set({
        rawMidiData: buffer,
        parsedMidi: parsed,
        basicMidi,
        fileName: displayName,
        currentPiece: piece,
        originalKeySignature: parsed.keySignature,
        tracks: parsed.tracks,
        transposeSemitones: 0,
        mutedTracks: new Set(),
        soloTracks: new Set(),
        isLoading: false,
        loadError: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load preset';
      set({ isLoading: false, loadError: message });
    }
  },

  setTransposeSemitones: (semitones) => {
    const clamped = Math.max(-12, Math.min(12, semitones));
    set({ transposeSemitones: clamped });
  },

  toggleMuteTrack: (trackIndex) => {
    set((state) => {
      const next = new Set(state.mutedTracks);
      if (next.has(trackIndex)) next.delete(trackIndex);
      else next.add(trackIndex);
      applyMuteState(state.tracks, next, state.soloTracks);
      return { mutedTracks: next };
    });
  },

  toggleSoloTrack: (trackIndex) => {
    set((state) => {
      const next = new Set(state.soloTracks);
      if (next.has(trackIndex)) next.delete(trackIndex);
      else next.add(trackIndex);
      applyMuteState(state.tracks, state.mutedTracks, next);
      return { soloTracks: next };
    });
  },

  setLoadError: (message) => set({ isLoading: false, loadError: message }),

  reset: () => set({
    rawMidiData: null,
    parsedMidi: null,
    basicMidi: null,
    fileName: '',
    currentPiece: null,
    transposeSemitones: 0,
    originalKeySignature: null,
    tracks: [],
    mutedTracks: new Set(),
    soloTracks: new Set(),
    isLoading: false,
    loadError: null,
  }),
}));
