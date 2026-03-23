import { create } from 'zustand';
import type { SoundQuality, SoundFontInfo } from '../types/ui';

type SettingsStore = {
  soundQuality: SoundQuality;
  highQualitySoundFonts: Record<string, SoundFontInfo>;
  selectedSoundFont: string;

  setSoundQuality: (quality: SoundQuality) => void;
  downloadSoundFont: (id: string, url: string) => Promise<void>;
  setSelectedSoundFont: (id: string) => void;
};

export const useSettingsStore = create<SettingsStore>()((set) => ({
  soundQuality: 'light',
  highQualitySoundFonts: {},
  selectedSoundFont: 'generaluser-gs',

  setSoundQuality: (quality) => set({ soundQuality: quality }),

  downloadSoundFont: async (_id, _url) => {
    // TODO: use soundfont-loader to download, cache, and register
  },

  setSelectedSoundFont: (id) => set({ selectedSoundFont: id }),
}));
