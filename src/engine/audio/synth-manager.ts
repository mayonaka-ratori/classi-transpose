import { WorkletSynthesizer } from 'spessasynth_lib';
import { BasicMIDI } from 'spessasynth_core';
import type { MidiTrack } from '../../types/midi';
import { computeChannelMutes } from '../midi/track-state';

const PROCESSOR_URL = '/spessasynth_processor.min.js';
const DEFAULT_SOUNDFONT_URL = '/soundfonts/GeneralUser_GS.sf2';
const DRUM_CHANNEL = 9;
const MIDI_CHANNELS = 16;

let audioContext: AudioContext | null = null;
let synthesizer: WorkletSynthesizer | null = null;
let soundFontLoaded = false;

/**
 * Initialize the AudioContext and Synthesizer.
 * Must be called after a user gesture (browser autoplay policy).
 */
export async function initAudio(): Promise<void> {
  if (synthesizer) return; // already initialized

  audioContext = new AudioContext();
  await audioContext.audioWorklet.addModule(PROCESSOR_URL);

  synthesizer = new WorkletSynthesizer(audioContext);
  synthesizer.connect(audioContext.destination);

  await loadDefaultSoundFont();
}

async function loadDefaultSoundFont(): Promise<void> {
  if (!synthesizer || soundFontLoaded) return;

  try {
    const response = await fetch(DEFAULT_SOUNDFONT_URL);
    if (!response.ok) {
      console.warn('Default SoundFont not found — playback will be silent until a SoundFont is loaded.');
      return;
    }
    const buffer = await response.arrayBuffer();
    await synthesizer.soundBankManager.addSoundBank(buffer, 'default');
    await synthesizer.isReady;
    soundFontLoaded = true;
  } catch (err) {
    console.warn('Failed to load default SoundFont:', err);
  }
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
 * Computes which channels should be muted based on track mute/solo sets,
 * then calls synthesizer.muteChannel() for each affected channel.
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
 * Load a SoundFont from the given URL and replace the current one.
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
 * This is set by the parser and used by the playback scheduler.
 */
let currentBasicMidi: BasicMIDI | null = null;

export function setCurrentMidi(midi: BasicMIDI): void {
  currentBasicMidi = midi;
}

export function getCurrentMidi(): BasicMIDI | null {
  return currentBasicMidi;
}
