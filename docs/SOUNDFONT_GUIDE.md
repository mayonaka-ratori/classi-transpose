# SoundFont Guide

## Bundled SoundFont (Light Mode)

### GeneralUser GS v2.0 (SF3)
- File: public/soundfonts/GeneralUser_GS.sf3
- Size: ~5 MB (Vorbis compressed)
- License: Free (commercial use OK, redistribution OK, attribution appreciated)
- Source: https://schristiancollins.com/generaluser.php
- Covers all 128 GM instruments + drum kits
- Quality is solid — sufficient for most classical pieces

## High-Quality SoundFonts (Optional)

### Piano: Salamander Grand Piano v3
- Size: ~40 MB (SF2) / ~12 MB (SF3)
- License: CC BY 3.0
- Source: https://freepats.zenvoid.org/Piano/SalamanderGrandPiano/
- Sampled from a real Yamaha C5 grand piano
- 16 velocity layers, pedal resonance

### Strings: Sonatina Symphonic Orchestra (SSO)
- Size: ~400 MB (full SF2) — extract individual instruments
- License: CC Sampling Plus 1.0
- Covers full orchestra

## Distribution Strategy
1. GeneralUser GS (SF3) bundled with the app (included in initial load)
2. High-quality SFs hosted externally (Vercel Blob Storage or CDN), downloaded on demand
3. Downloaded SFs cached via Service Worker + Cache API (persistent)
4. Future: allow users to upload their own SF2 files

## Attribution
Display in footer or settings screen:
- "SoundFont: GeneralUser GS by S. Christian Collins"
- Add attribution for any high-quality SF in use
