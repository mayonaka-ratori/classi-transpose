---
paths:
  - "src/engine/audio/**/*.ts"
---

# Audio Engine Design Rules

## Library
- Use `spessasynth_lib` for SoundFont-based playback
- Sequencer class → MIDI playback control
- Synthesizer class → SoundFont instrument management

## AudioContext Management
- Create exactly ONE AudioContext for the entire app
- Resume it ONLY after a user gesture (tap / click) — browser autoplay policy
- Do NOT close the AudioContext on component unmount — reuse across SPA lifecycle

## SoundFont Management
- Light mode: GeneralUser GS (SF3, ~5 MB) bundled in public/soundfonts/
- High-quality mode: large SF2 files fetched on demand from external CDN or user upload
- SoundFont loading is async — always reflect loading state in UI
- Cache high-quality SoundFonts via Service Worker + Cache API

## Playback Control
- Play / pause / stop via Sequencer methods
- Seek by setting Sequencer.currentTime
- Tempo change via Sequencer.playbackRate (original data untouched)
- Transpose via Synthesizer channel transpose or note offset

## Performance
- Update playback position UI with requestAnimationFrame (never setInterval)
- Consider Web Worker for loading large SoundFonts
- Watch for memory leaks: always disconnect AudioNodes on cleanup
