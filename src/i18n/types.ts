export type Language = 'ja' | 'en';

export type Translations = {
  app: {
    title: string;
    tagline: string;
    htmlTitle: string;
    htmlDescription: string;
  };
  header: {
    langJa: string;
    langEn: string;
  };
  library: {
    title: string;
    pieces: (n: number) => string;
    emptyCategory: string;
    attribution: string;
    selectComposer: string;
    filterAriaLabel: string;
    composerAriaLabel: string;
    allCategory: string;
    uploadOwn: string;
    selectPiece: string;
  };
  upload: {
    dropHint: string;
    browseHint: string;
    loading: string;
    invalidType: string;
  };
  player: {
    play: string;
    pause: string;
    stop: string;
    sfLoading: (pct: number) => string;
    sfError: string;
    sfRetry: string;
    sfProgressAriaLabel: string;
  };
  transpose: {
    label: string;
    noChange: string;
    semitone: string;
    semitones: string;
    targetKey: string;
    sliderAriaLabel: string;
    downAriaLabel: string;
    upAriaLabel: string;
  };
  tempo: {
    label: string;
    bpm: string;
    reset: string;
    resetAriaLabel: string;
    sliderAriaLabel: string;
    inputAriaLabel: string;
    originalBpm: (bpm: number, max: number) => string;
  };
  loop: {
    label: string;
    setA: string;
    setB: string;
    clearAriaLabel: string;
    clear: string;
    activeStatus: (start: string, end: string) => string;
    pendingA: (time: string) => string;
  };
  tracks: {
    label: string;
    soloActive: string;
    trackFallback: (n: number) => string;
    channel: (n: number) => string;
    multi: string;
    noteCount: (n: number) => string;
    mute: string;
    unmute: string;
    solo: string;
    unsolo: string;
  };
  export: {
    label: string;
    button: string;
    exporting: string;
    exportingAriaLabel: string;
    exportAriaLabel: string;
    error: string;
  };
  errors: {
    invalidMidiSmall: string;
    invalidMidiHeader: string;
    failedToLoad: string;
    failedToLoadPreset: string;
    missingFile: (filename: string) => string;
  };
};
