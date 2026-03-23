import { create } from 'zustand';
import {
  play as enginePlay,
  pause as enginePause,
  stop as engineStop,
  seek as engineSeek,
  setPlaybackRate as engineSetPlaybackRate,
  setLoopConfig,
} from '../engine/audio/playback-scheduler';
import { resumeAudio } from '../engine/audio/synth-manager';

type PlayerStore = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  originalBpm: number;
  tempoScale: number;
  loopEnabled: boolean;
  loopStart: number;
  loopEnd: number;

  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setTempoScale: (scale: number) => void;
  setLoop: (start: number, end: number) => void;
  toggleLoop: () => void;
  clearLoop: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setOriginalBpm: (bpm: number) => void;
};

export const usePlayerStore = create<PlayerStore>()((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  originalBpm: 120,
  tempoScale: 1.0,
  loopEnabled: false,
  loopStart: 0,
  loopEnd: 0,

  play: async () => {
    await resumeAudio();
    enginePlay();
    set({ isPlaying: true });
  },

  pause: () => {
    enginePause();
    set({ isPlaying: false });
  },

  stop: () => {
    engineStop();
    set({ isPlaying: false, currentTime: 0 });
  },

  seek: (time) => {
    engineSeek(time);
    set({ currentTime: time });
  },

  setTempoScale: (scale) => {
    const clamped = Math.max(0.25, Math.min(4.0, scale));
    engineSetPlaybackRate(clamped);
    set({ tempoScale: clamped });
  },

  setLoop: (start, end) => {
    setLoopConfig({ enabled: true, start, end });
    set({ loopStart: start, loopEnd: end, loopEnabled: true });
  },

  toggleLoop: () =>
    set((s) => {
      const newEnabled = !s.loopEnabled;
      setLoopConfig({ enabled: newEnabled, start: s.loopStart, end: s.loopEnd });
      return { loopEnabled: newEnabled };
    }),

  clearLoop: () => {
    setLoopConfig({ enabled: false, start: 0, end: 0 });
    set({ loopEnabled: false, loopStart: 0, loopEnd: 0 });
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setOriginalBpm: (bpm) => set({ originalBpm: bpm }),
}));
