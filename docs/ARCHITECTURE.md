# Architecture

## Layer Diagram

```
┌─────────────────────────────────────────────┐
│              UI Layer (React)                │
│  components/ + hooks/ + stores/             │
│  Receives user input, renders state         │
└──────────────┬──────────────────────────────┘
               │  Zustand stores
┌──────────────▼──────────────────────────────┐
│           Engine Layer (Pure TypeScript)     │
│  engine/midi/ + engine/audio/               │
│  MIDI parsing, transform, export            │
│  SoundFont management, playback control     │
│  ZERO React dependency                      │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│          Library Layer (External)            │
│  spessasynth_lib / spessasynth_core         │
│  Web Audio API                              │
└─────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── main.tsx
├── App.tsx
├── index.css
│
├── stores/
│   ├── useMidiStore.ts
│   ├── usePlayerStore.ts
│   └── useSettingsStore.ts
│
├── engine/
│   ├── midi/
│   │   ├── parser.ts
│   │   ├── transpose.ts
│   │   ├── tempo.ts
│   │   ├── exporter.ts
│   │   └── music-theory.ts
│   └── audio/
│       ├── synth-manager.ts
│       ├── playback-scheduler.ts
│       └── soundfont-loader.ts
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── MobileLayout.tsx
│   │   └── DesktopLayout.tsx
│   ├── file/
│   │   ├── FileUploader.tsx
│   │   └── PresetSelector.tsx
│   ├── controls/
│   │   ├── TransposeControl.tsx
│   │   ├── BpmControl.tsx
│   │   ├── PlayerControl.tsx
│   │   └── LoopControl.tsx
│   ├── tracks/
│   │   └── TrackList.tsx
│   ├── export/
│   │   └── MidiExporter.tsx
│   └── settings/
│       └── SoundQualitySelector.tsx
│
├── hooks/
│   ├── useMidiPlayer.ts
│   ├── useTranspose.ts
│   └── useAudioContext.ts
│
├── utils/
│   ├── constants.ts
│   ├── file-helpers.ts
│   └── responsive.ts
│
└── types/
    ├── midi.ts
    ├── music.ts
    └── ui.ts
```

## Data Flows

### Load MIDI File
```
User drops .mid → FileUploader
  → useMidiStore.loadFile(arrayBuffer)
  → engine/midi/parser.ts  parseMidiFile()
  → spessasynth_core parses binary
  → convert to internal MidiData type
  → store in useMidiStore
  → UI reacts
```

### Real-Time Transpose
```
User moves slider → TransposeControl
  → useMidiStore.setTransposeSemitones(n)
  → engine/audio/synth-manager.ts  applyTranspose(n)
  → spessasynth_lib Synthesizer channel transpose
  → next notes play at new pitch instantly
```

### Real-Time BPM Change
```
User moves slider → BpmControl
  → usePlayerStore.setTempoScale(ratio)
  → engine/audio/playback-scheduler.ts  setPlaybackRate(ratio)
  → spessasynth_lib Sequencer.playbackRate
  → tempo changes instantly
```

### MIDI Export
```
User clicks Export → MidiExporter
  → engine/midi/exporter.ts  exportMidi(options)
  → clone original MidiData
  → apply transpose (pitch add) to clone
  → apply BPM (tempo event rewrite) to clone
  → remove unselected tracks
  → spessasynth_core writes binary
  → Blob → download .mid
```

## Zustand Store Schemas

### useMidiStore
```typescript
type MidiStore = {
  rawMidiData: ArrayBuffer | null;
  parsedMidi: MidiData | null;
  fileName: string;
  transposeSemitones: number;          // -12 to +12
  originalKeySignature: KeySignature | null;
  tracks: MidiTrack[];
  mutedTracks: Set<number>;
  soloTracks: Set<number>;

  loadFile: (buffer: ArrayBuffer, name: string) => Promise<void>;
  loadPreset: (presetId: string) => Promise<void>;
  setTransposeSemitones: (semitones: number) => void;
  toggleMuteTrack: (trackIndex: number) => void;
  toggleSoloTrack: (trackIndex: number) => void;
};
```

### usePlayerStore
```typescript
type PlayerStore = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  originalBpm: number;
  tempoScale: number;                 // 0.25 to 4.0
  loopEnabled: boolean;
  loopStart: number;
  loopEnd: number;

  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setTempoScale: (scale: number) => void;
  setLoop: (start: number, end: number) => void;
  toggleLoop: () => void;
};
```

### useSettingsStore
```typescript
type SettingsStore = {
  soundQuality: 'light' | 'high';
  highQualitySoundFonts: Record<string, SoundFontInfo>;
  selectedSoundFont: string;

  setSoundQuality: (quality: 'light' | 'high') => void;
  downloadSoundFont: (id: string, url: string) => Promise<void>;
};
```
