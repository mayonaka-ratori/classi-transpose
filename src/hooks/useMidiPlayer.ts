import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useMidiStore } from '../stores/useMidiStore';
import { initAudio, applyTranspose } from '../engine/audio/synth-manager';
import { onTimeUpdate, offTimeUpdate, getDuration } from '../engine/audio/playback-scheduler';
import { getOriginalBpm } from '../engine/midi/tempo';

/**
 * Initializes the audio engine and syncs playback state with stores.
 * Mount this hook once at the app root.
 */
export function useMidiPlayer(): void {
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setOriginalBpm = usePlayerStore((s) => s.setOriginalBpm);
  const parsedMidi = useMidiStore((s) => s.parsedMidi);
  const transposeSemitones = useMidiStore((s) => s.transposeSemitones);

  const audioInitialized = useRef(false);

  // Initialize audio engine on first mount (deferred until a soundfont exists)
  useEffect(() => {
    if (audioInitialized.current) return;
    audioInitialized.current = true;
    initAudio().catch((err: unknown) => {
      console.error('Failed to initialize audio:', err);
    });
  }, []);

  // Sync time updates from playback engine to store
  useEffect(() => {
    onTimeUpdate((time, duration) => {
      setCurrentTime(time);
      setDuration(duration);
    });
    return () => {
      offTimeUpdate();
    };
  }, [setCurrentTime, setDuration]);

  // Sync duration and original BPM when a new MIDI is loaded
  useEffect(() => {
    if (!parsedMidi) return;
    const bpm = getOriginalBpm(parsedMidi.tempoEvents);
    setOriginalBpm(bpm);
    setDuration(getDuration());
  }, [parsedMidi, setOriginalBpm, setDuration]);

  // Apply transpose whenever semitones change
  useEffect(() => {
    applyTranspose(transposeSemitones);
  }, [transposeSemitones]);
}
