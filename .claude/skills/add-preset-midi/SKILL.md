---
name: add-preset-midi
description: Add a preset MIDI file (public domain) to the app
disable-model-invocation: true
argument-hint: [song-name]
allowed-tools: Read, Write, Bash
---

# Add Preset MIDI: $ARGUMENTS

## 1. Source the MIDI file
Verify public-domain / copyright-expired status. Recommended sources:
- https://www.kunstderfuge.com/
- https://www.mutopiaproject.org/
- https://imslp.org/

## 2. Place the file
- Path: `public/presets/{composer}_{title}.mid` (snake_case, ASCII only)
- Example: `bach_invention_1.mid`, `beethoven_fur_elise.mid`

## 3. Update preset registry
Add an entry to `PRESET_SONGS` in `src/utils/constants.ts`:
```typescript
{
  id: 'bach_invention_1',
  title: 'Invention No.1 in C major',
  composer: 'J.S. Bach',
  catalogNumber: 'BWV 772',
  file: '/presets/bach_invention_1.mid',
  originalKey: 'C major',
  estimatedBpm: 80,
}
```

## 4. Verify
Select the new preset from the UI and confirm playback works.

Report results to the user in Japanese.
