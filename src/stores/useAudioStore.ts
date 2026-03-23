import { create } from 'zustand';
import { loadHQSoundFont, isSoundFontLoaded } from '../engine/audio/synth-manager';

export type AudioQuality = 'standard' | 'hq';
export type SfLoadState = 'idle' | 'loading' | 'loaded' | 'error';

type AudioStore = {
  /** Current audio quality mode. */
  quality: AudioQuality;
  /** Current SoundFont loading state. */
  sfLoadState: SfLoadState;
  /** Download progress 0–100 (only meaningful when sfLoadState = 'loading'). */
  sfLoadProgress: number;
  /** Error message when sfLoadState = 'error'. */
  sfError: string | null;

  /**
   * Switch to High Quality mode: lazily downloads and loads the SF2.
   * If the SF is already loaded, the switch is instant.
   * On failure, reverts to Standard mode and populates sfError.
   */
  enableHQ: () => Promise<void>;

  /** Switch back to Standard mode (SF stays in memory — switching to HQ again is instant). */
  enableStandard: () => void;
};

export const useAudioStore = create<AudioStore>()((set) => ({
  quality: 'standard',
  // If the SF2 was loaded in a previous session (same page lifecycle), reflect that
  sfLoadState: isSoundFontLoaded() ? 'loaded' : 'idle',
  sfLoadProgress: isSoundFontLoaded() ? 100 : 0,
  sfError: null,

  enableHQ: async () => {
    // If already loaded, just flip the mode — no download needed
    if (isSoundFontLoaded()) {
      set({ quality: 'hq', sfLoadState: 'loaded', sfLoadProgress: 100, sfError: null });
      return;
    }

    set({ quality: 'hq', sfLoadState: 'loading', sfLoadProgress: 0, sfError: null });

    try {
      await loadHQSoundFont((pct) => {
        set({ sfLoadProgress: pct });
      });
      set({ sfLoadState: 'loaded', sfLoadProgress: 100 });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load SoundFont';
      set({
        quality: 'standard',
        sfLoadState: 'error',
        sfError: message,
      });
    }
  },

  enableStandard: () => {
    set({ quality: 'standard' });
  },
}));
