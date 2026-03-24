import { create } from 'zustand';
import { loadHQSoundFont, isSoundFontLoaded } from '../engine/audio/synth-manager';

export type SfLoadState = 'idle' | 'loading' | 'loaded' | 'error';

type AudioStore = {
  /** Current SoundFont loading state. */
  sfLoadState: SfLoadState;
  /** Download progress 0–100 (only meaningful when sfLoadState = 'loading'). */
  sfLoadProgress: number;
  /** Error message when sfLoadState = 'error'. */
  sfError: string | null;

  /**
   * Trigger HQ SoundFont loading. Safe to call multiple times — no-op if already loaded.
   * On failure, sets sfLoadState = 'error' and populates sfError.
   */
  loadSoundFont: () => Promise<void>;

  /** Clear any error and reset to idle so the user can retry. */
  clearError: () => void;
};

export const useAudioStore = create<AudioStore>()((set) => ({
  sfLoadState: isSoundFontLoaded() ? 'loaded' : 'idle',
  sfLoadProgress: isSoundFontLoaded() ? 100 : 0,
  sfError: null,

  loadSoundFont: async () => {
    // If already loaded, nothing to do
    if (isSoundFontLoaded()) {
      set({ sfLoadState: 'loaded', sfLoadProgress: 100, sfError: null });
      return;
    }

    set({ sfLoadState: 'loading', sfLoadProgress: 0, sfError: null });

    try {
      await loadHQSoundFont((pct) => {
        set({ sfLoadProgress: pct });
      });
      set({ sfLoadState: 'loaded', sfLoadProgress: 100 });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load SoundFont';
      set({ sfLoadState: 'error', sfError: message });
    }
  },

  clearError: () => {
    set({ sfLoadState: 'idle', sfLoadProgress: 0, sfError: null });
  },
}));
