# Domain Knowledge — Music Theory & MIDI

## Transposition Basics

### Semitones and Key Names
One octave = 12 semitones. Transposition shifts every note by the same number of semitones.

### Key Name Table (Major Keys)
| Semitone Offset | Sharp Notation | Flat Notation |
|-----------------|----------------|---------------|
| 0               | C              | C             |
| +1              | C♯             | D♭            |
| +2              | D              | D             |
| +3              | D♯             | E♭            |
| +4              | E              | E             |
| +5              | F              | F             |
| +6              | F♯             | G♭            |
| +7              | G              | G             |
| +8              | G♯             | A♭            |
| +9              | A              | A             |
| +10             | A♯             | B♭            |
| +11             | B              | B             |

### Conventional Spelling
- Prefer D♭ major (not C♯ major)
- Prefer E♭ major (not D♯ major)
- Both F♯ major and G♭ major are acceptable
- The UI should prefer the common spelling

### Minor Keys
- A minor key is the relative minor of the major key 3 semitones above
  (e.g., A minor = relative minor of C major)
- MIDI Key Signature events indicate major/minor
- The UI can show both: "C major / A minor"

## MIDI Fundamentals

### Note Numbers
- 0-127 integer. 60 = Middle C (C4)
- Piano 88 keys span 21 (A0) through 108 (C8)

### Channels
- 16 channels (0-15)
- Channel 9 (0-indexed) = drums — NEVER transpose this channel
- Channel 9 uses percussion mapping, not pitched notes

### Tempo
- Stored as microseconds per quarter note
- BPM = 60,000,000 / microseconds_per_quarter
- A single file may contain multiple Set Tempo events (tempo changes)

### MIDI Ticks and Real Time
- MIDI measures time in ticks
- PPQ (Pulses Per Quarter note) is in the file header
- Real time (seconds) = ticks × (microseconds_per_quarter / PPQ) / 1,000,000

## SoundFont Basics

### SF2 vs SF3
- SF2: uncompressed samples — high quality, large file size
- SF3: Vorbis-compressed — 5-10× smaller, same quality at runtime
- spessasynth_lib supports both

### General MIDI (GM)
- Standard set of 128 instrument sounds
- Program Change number selects instrument
- 0 = Acoustic Grand Piano, 40 = Violin, etc.

### GeneralUser GS
- High-quality free GM SoundFont by S. Christian Collins
- ~5 MB as SF3 — ideal for light mode
- Covers all 128 GM sounds + drum kits
