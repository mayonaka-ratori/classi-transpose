import { WorkletSynthesizer } from 'spessasynth_lib';
import { BasicMIDI } from 'spessasynth_core';
import type { MidiTrack } from '../../types/midi';
import { computeChannelMutes } from '../midi/track-state';
import { fetchWithProgress } from './soundfont-loader';

const PROCESSOR_URL = '/spessasynth_processor.min.js';

const HQ_SOUNDFONT_URL = '/soundfonts/GeneralUser-GS.sf2';
const DRUM_CHANNEL = 9;
const MIDI_CHANNELS = 16;

let audioContext: AudioContext | null = null;
let synthesizer: WorkletSynthesizer | null = null;
let soundFontLoaded = false;

/**
 * Initialize the AudioContext and Synthesizer worklet.
 * Must be called after a user gesture (browser autoplay policy).
 * Does NOT load a SoundFont — call loadHQSoundFont() separately.
 */
export async function initAudio(): Promise<void> {
  if (synthesizer) return; // already initialized

  audioContext = new AudioContext();
  await audioContext.audioWorklet.addModule(PROCESSOR_URL);

  synthesizer = new WorkletSynthesizer(audioContext);
  synthesizer.connect(audioContext.destination);
}

/**
 * Load the High-Quality SoundFont (GeneralUser GS SF2) into the synthesizer.
 * Safe to call multiple times — subsequent calls are no-ops once loaded.
 *
 * @param onProgress  Optional callback receiving a 0–100 download progress value.
 * @throws            If the download fails or the synthesizer is not yet initialized.
 */
export async function loadHQSoundFont(
  onProgress?: (pct: number) => void,
): Promise<void> {
  if (soundFontLoaded) return; // already loaded — instant switch

  // Ensure synthesizer is ready (may be called before play() triggers initAudio)
  await initAudio();

  if (!synthesizer) throw new Error('Synthesizer not initialized');

  const progress = onProgress ?? ((_pct: number): void => { /* noop */ });
  const buffer = await fetchWithProgress(HQ_SOUNDFONT_URL, progress);
  await synthesizer.soundBankManager.addSoundBank(buffer, 'hq');
  await synthesizer.isReady;
  soundFontLoaded = true;
}

/**
 * Resume the AudioContext after a user gesture.
 */
export async function resumeAudio(): Promise<void> {
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
  }
}

/**
 * Apply a semitone transpose to all non-drum channels.
 */
export function applyTranspose(semitones: number): void {
  if (!synthesizer) return;
  for (let ch = 0; ch < MIDI_CHANNELS; ch++) {
    if (ch === DRUM_CHANNEL) continue;
    synthesizer.transposeChannel(ch, semitones);
  }
}

/**
 * Apply mute/solo state to all channels.
 */
export function applyMuteState(
  tracks: readonly MidiTrack[],
  mutedTracks: ReadonlySet<number>,
  soloTracks: ReadonlySet<number>,
): void {
  if (!synthesizer) return;
  const muteMap = computeChannelMutes(tracks, mutedTracks, soloTracks);
  for (const [ch, isMuted] of Object.entries(muteMap)) {
    synthesizer.muteChannel(Number(ch), isMuted ?? false);
  }
}

/**
 * Load a SoundFont from the given URL and add it to the bank manager.
 */
export async function loadSoundFont(url: string, id = 'custom'): Promise<void> {
  if (!synthesizer) throw new Error('Synthesizer not initialized');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch SoundFont: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  await synthesizer.soundBankManager.addSoundBank(buffer, id);
  await synthesizer.isReady;
}

/**
 * Load a SoundFont from an ArrayBuffer directly.
 */
export async function loadSoundFontBuffer(buffer: ArrayBuffer, id = 'upload'): Promise<void> {
  if (!synthesizer) throw new Error('Synthesizer not initialized');
  await synthesizer.soundBankManager.addSoundBank(buffer, id);
  await synthesizer.isReady;
}

export function getSynthesizer(): WorkletSynthesizer | null {
  return synthesizer;
}

export function getAudioContext(): AudioContext | null {
  return audioContext;
}

export function isSoundFontLoaded(): boolean {
  return soundFontLoaded;
}

/**
 * Keep the BasicMIDI reference for the Sequencer.
 */
let currentBasicMidi: BasicMIDI | null = null;

export function setCurrentMidi(midi: BasicMIDI): void {
  currentBasicMidi = midi;
}

export function getCurrentMidi(): BasicMIDI | null {
  return currentBasicMidi;
}
