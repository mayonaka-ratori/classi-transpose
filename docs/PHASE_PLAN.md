# Phase Plan

## Phase 1 — Foundation (Day 1-2)
**Goal**: Upload a MIDI file, press play, hear sound.

### Tasks
- [ ] Run `/setup-project` skill to bootstrap
- [ ] Create type definitions in src/types/ (MidiData, MidiTrack, etc.)
- [ ] src/engine/audio/synth-manager.ts: init AudioContext, load SF3, create Synthesizer
- [ ] src/engine/midi/parser.ts: ArrayBuffer → MidiData
- [ ] src/engine/audio/playback-scheduler.ts: init Sequencer, play/pause/stop
- [ ] src/stores/useMidiStore.ts: loadFile, parsedMidi state
- [ ] src/stores/usePlayerStore.ts: isPlaying, play, pause, stop
- [ ] src/components/file/FileUploader.tsx: drag-and-drop + file picker
- [ ] src/components/controls/PlayerControl.tsx: play/stop buttons
- [ ] src/components/layout/Header.tsx + MobileLayout.tsx
- [ ] Place GeneralUser GS SF3 in public/soundfonts/

### Done When
1. Drop a MIDI file → press play → sound plays
2. Stop button silences playback
3. Layout doesn't break on 375 px mobile screen

---

## Phase 2 — Transpose (Day 3-4)
**Goal**: Moving the slider during playback changes the key instantly.

### Tasks
- [ ] src/engine/midi/music-theory.ts: key name table, semitone ↔ key conversion
- [ ] src/engine/midi/transpose.ts: non-destructive transpose logic
- [ ] Integrate transposeChannel into synth-manager.ts
- [ ] Add transposeSemitones to useMidiStore
- [ ] src/components/controls/TransposeControl.tsx: slider + dropdown (bidirectional sync)
- [ ] src/utils/constants.ts: KEY_SIGNATURES constant
- [ ] engine/midi/transpose.test.ts: unit tests

### Done When
1. Slider changes key in real-time during playback
2. Key name dropdown and slider are synced
3. Drum track is never transposed
4. All unit tests pass

---

## Phase 3 — BPM Control (Day 5)
**Goal**: Moving the BPM slider during playback changes tempo instantly.

### Tasks
- [ ] src/engine/midi/tempo.ts: read tempo events, compute scale
- [ ] Add playbackRate control to playback-scheduler.ts
- [ ] Add tempoScale, originalBpm to usePlayerStore
- [ ] src/components/controls/BpmControl.tsx: slider + numeric input + reset button
- [ ] engine/midi/tempo.test.ts: unit tests

### Done When
1. BPM slider changes tempo in real-time
2. Original BPM is correctly detected and displayed
3. "Reset" button returns to 100%

---

## Phase 4 — Playback Controls (Day 6-7)
**Goal**: Loop a section while soloing specific tracks.

### Tasks
- [ ] Add seek bar to PlayerControl.tsx
- [ ] src/components/controls/LoopControl.tsx: A-B loop UI
- [ ] src/components/tracks/TrackList.tsx: track list + mute/solo
- [ ] src/components/file/PresetSelector.tsx: preset song picker
- [ ] Add loop state to usePlayerStore
- [ ] Add mute/solo state to useMidiStore
- [ ] Place preset MIDI files in public/presets/
- [ ] requestAnimationFrame-based playback position updates

### Done When
1. Seek bar allows position jumping
2. A-B loop works
3. Track mute/solo works
4. Preset songs can be selected and played

---

## Phase 5 — MIDI Export (Day 8-9)
**Goal**: Exported .mid opens correctly in a DAW with transpose + BPM applied.

### Tasks
- [ ] src/engine/midi/exporter.ts: clone → transpose → tempo → binary output
- [ ] src/components/export/MidiExporter.tsx: option checkboxes + download button
- [ ] Export options: apply transpose / apply BPM / selected tracks only
- [ ] exporter.test.ts: export → re-parse → verify content

### Done When
1. Exported .mid plays correctly in a DAW (or SpessaSynth)
2. Note numbers reflect the transpose
3. Tempo events reflect the BPM change
4. Track selection export works

---

## Phase 6 — Sound Quality (Day 10-11)
**Goal**: Download a high-quality piano SoundFont; cached for instant reload.

### Tasks
- [ ] src/components/settings/SoundQualitySelector.tsx
- [ ] src/stores/useSettingsStore.ts: soundQuality, selectedSoundFont
- [ ] src/engine/audio/soundfont-loader.ts: on-demand download + Cache API
- [ ] Service Worker setup
- [ ] Host high-quality SoundFont on external CDN

### Done When
1. Light / high quality toggling works
2. High-quality SF downloads only once
3. Subsequent loads come from cache instantly
4. Download progress is shown in UI

---

## Phase 7 — Polish (Day 12-14)
**Goal**: Production-ready deployment.

### Tasks
- [ ] DesktopLayout.tsx (2-column responsive)
- [ ] PWA setup (manifest.json, Service Worker)
- [ ] OGP image, favicon
- [ ] Performance profiling & optimization
- [ ] Playwright E2E tests
- [ ] README.md
- [ ] Vercel deploy config
- [ ] License attributions (SoundFont credits)

### Done When
1. Lighthouse scores ≥ 90 on all categories
2. Works on mobile, tablet, and desktop
3. Auto-deploys to Vercel on push
