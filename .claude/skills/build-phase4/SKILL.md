# Skill: Build Phase 4 Features
## Description
Implement Phase 4 features using the premium glassmorphism design system.
## Prerequisites
- Premium theme must be applied first
- Phase 1-3 functionality must be working
## Reference
Read .claude/rules/design-system.md and docs/UI_SPEC.md before starting.
## Steps
### Step 1: Enhanced Seek Bar
Create src/components/controls/SeekBar.tsx
- Gradient progress fill (rose to pink) on bg-black/10 track
- Smooth glass thumb (14px circle, white, rose border)
- Monospace time display (elapsed / total)
- Click-to-seek on track
- Touch-friendly: 44px minimum touch target
### Step 2: A-B Loop Control
Create src/components/controls/LoopControl.tsx
- Glass pill buttons: [A] [B] [Clear]
- Visual markers on seek bar for loop region
- Loop region highlighted with rose-light overlay
- Add loopStart, loopEnd, isLooping to usePlayerStore
- Connect loop logic in useMidiPlayer hook
### Step 3: Track Mute/Solo List
Create src/components/tracks/TrackList.tsx
- Glass-subtle rows per track
- Instrument emoji + track name on left
- [S] Solo toggle (accent-rose when active) and [M] Mute toggle on right
- Add track mute/solo state to useMidiStore
- Connect to synth-manager channel mute/solo
### Step 4: Preset Song Selector
Create src/components/file/PresetSelector.tsx
- Grid of glass cards (2-col mobile, 3-col desktop)
- Each card: composer (small serif), piece name (serif primary), key + duration
- Click loads preset MIDI file
- Currently playing preset highlighted with rose border
- Use PRESET_SONGS from constants.ts
### Step 5: Integrate into Layout
Update MobileLayout.tsx:
- Add SeekBar inside playback section
- Add LoopControl below SeekBar
- Add TrackList card after BPM card
- Add PresetSelector in file section
- Desktop: two-column grid at lg: breakpoint
### Step 6: Verify
Run: npm run type-check && npm run lint && npm run test && npm run dev
Test all new features manually.
## Reporting Language
Report progress and results in Japanese.
