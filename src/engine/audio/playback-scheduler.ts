import { Sequencer } from 'spessasynth_lib';
import { BasicMIDI } from 'spessasynth_core';
import { getSynthesizer } from './synth-manager';

type LoopConfig = {
  enabled: boolean;
  start: number;
  end: number;
};

let sequencer: Sequencer | null = null;
let timeUpdateCallback: ((time: number, duration: number) => void) | null = null;
let rafId: number | null = null;
let loopConfig: LoopConfig = { enabled: false, start: 0, end: 0 };

/**
 * Initialize (or re-initialize) the Sequencer with a new MIDI file.
 */
export function initSequencer(midi: BasicMIDI): void {
  const synth = getSynthesizer();
  if (!synth) throw new Error('Synthesizer not initialized — call initAudio() first');

  // Dispose previous sequencer if any
  if (sequencer) {
    sequencer.pause();
  }

  sequencer = new Sequencer(synth);
  sequencer.loadNewSongList([midi]);

  startRaf();
}

/**
 * Start playback.
 */
export function play(): void {
  if (!sequencer) return;
  sequencer.play();
}

/**
 * Pause playback.
 */
export function pause(): void {
  if (!sequencer) return;
  sequencer.pause();
}

/**
 * Stop playback and reset to the beginning.
 */
export function stop(): void {
  if (!sequencer) return;
  sequencer.pause();
  sequencer.currentTime = 0;
}

/**
 * Seek to a position in seconds.
 */
export function seek(timeSeconds: number): void {
  if (!sequencer) return;
  sequencer.currentTime = timeSeconds;
}

/**
 * Set playback rate (1.0 = normal, 0.5 = half speed, 2.0 = double speed).
 */
export function setPlaybackRate(rate: number): void {
  if (!sequencer) return;
  sequencer.playbackRate = rate;
}

/**
 * Get current playback position in seconds.
 */
export function getCurrentTime(): number {
  return sequencer?.currentTime ?? 0;
}

/**
 * Get total duration in seconds.
 */
export function getDuration(): number {
  return sequencer?.duration ?? 0;
}

/**
 * Register a callback that fires on each animation frame with current time and duration.
 */
export function onTimeUpdate(callback: (time: number, duration: number) => void): void {
  timeUpdateCallback = callback;
}

/**
 * Remove the time update callback.
 */
export function offTimeUpdate(): void {
  timeUpdateCallback = null;
}

/**
 * Configure A-B loop. Pass enabled:false to disable.
 */
export function setLoopConfig(config: LoopConfig): void {
  loopConfig = config;
}

function startRaf(): void {
  if (rafId !== null) cancelAnimationFrame(rafId);

  const tick = (): void => {
    if (sequencer) {
      // Enforce A-B loop: seek back to start when end is reached
      if (
        loopConfig.enabled &&
        loopConfig.end > loopConfig.start &&
        sequencer.currentTime >= loopConfig.end
      ) {
        sequencer.currentTime = loopConfig.start;
      }
      if (timeUpdateCallback) {
        timeUpdateCallback(sequencer.currentTime, sequencer.duration);
      }
    }
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
}
