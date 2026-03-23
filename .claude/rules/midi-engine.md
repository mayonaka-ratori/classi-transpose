---
paths:
  - "src/engine/midi/**/*.ts"
---

# MIDI Engine Design Rules

## Library
- Use `spessasynth_core` for MIDI parsing and writing
- Do NOT expose spessasynth_core types outside engine/ — map to own types defined in src/types/midi.ts

## Transpose Logic
- MIDI note numbers are integers 0-127. Transpose = add semitone offset to every note
- Clamp notes that would go below 0 or above 127 (do not discard them)
- NEVER transpose the drum channel (channel 10 = MIDI channel 9, 0-indexed)
- Store transpose as a display offset; apply at playback time — original data is immutable (non-destructive editing)

## BPM Logic
- Read Set Tempo meta-events from the MIDI file
- BPM change = scale ALL tempo events by the same ratio (multiplier approach)
- Display BPM = first tempo event BPM × user-specified scale
- MIDIs with multiple tempo events: apply the same ratio to each one

## MIDI Export
- On export ONLY: clone original data, apply transpose (pitch add) and BPM (tempo rewrite) to the clone
- Support exporting only user-selected tracks
- Output format: Standard MIDI File Format 1 (multi-track)

## Testing
- transpose() must be a pure function with unit tests
- Boundary tests: notes that would exceed 0-127 after transpose
- Drum channel exclusion test
- Round-trip test: export → re-parse → verify content
