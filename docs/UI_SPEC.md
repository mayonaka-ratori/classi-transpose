# UI Specification — ClassiTranspose Premium
## Design Language
Apple Music Classical-inspired: warm immersive backgrounds,
glassmorphism cards, serif typography, animated ambient blobs.
## Pages / States
### State 1: Empty (No file loaded)
- Full-screen warm gradient background with floating blobs
- Centered glass card with:
  - Large musical note icon (gold gradient)
  - "Drop your MIDI file here" in serif
  - "or choose from the classical collection" in sans
  - Drag-and-drop zone (dashed gold border)
  - Preset song grid below (small glass cards with song names)
- Header: app title in serif + quality toggle
### State 2: File Loaded (Playing/Paused/Stopped)
- Background blobs continue floating
- Mobile: vertical stack of glass cards
  1. Song Info Card (elevated glass): title, composer, key, tempo
  2. Playback Card: seek bar + transport controls
  3. Transpose Card: slider + key display
  4. Tempo Card: slider + BPM display + reset
  5. Track List Card: mute/solo per track
  6. Export Card: download button
- Desktop: two-column layout
  - Left: Song Info + Playback + File Selector
  - Right: Transpose + Tempo + Tracks + Export
### State 3: Exporting
- Export button shows progress spinner
- On complete: brief success toast (glass card, slides down from top)
## Component Specifications
### Header
- Height: 56px mobile, 64px desktop
- Background: bg-white/40 backdrop-blur-2xl border-b border-white/20
- Title: "ClassiTranspose" in Source Serif 4, weight 700
- Optional gold note icon before title
- Right side: quality badge, file button
### Song Info Card
- Variant: elevated glass (bg-white/65 backdrop-blur-2xl)
- Title: Source Serif 4, 600, 20px mobile / 26px desktop
- Composer: Source Serif 4, italic, 15px/17px, text-secondary color
- Metadata row: key + tempo + duration in small pills
### Seek Bar
- Track: 4px height, rounded, bg-black/10
- Progress fill: gradient from-accent-rose to-[#E91E63]
- Thumb: 14px circle, white, rose border, shadow
- Time labels: monospace, text-tertiary
### Transport Controls
- Layout: skip-back, play/pause, skip-forward centered
- Play: 56px circle, rose gradient, white icon, pulses glow when playing
- Skip: 40px circle, glass bg, dark icon
### Transpose Control
- Section label: "TRANSPOSE" in Inter 600, uppercase, 12px, tracking-wide
- Value display: "+3" or "-2" in large serif
- Key display: "A minor -> C minor" in serif italic
- Slider: indigo gradient track, white glass thumb
- -/+ buttons: small glass circles
### BPM Control
- Section label: "TEMPO"
- Display: "85% (x0.85)" in monospace + BPM in serif
- Original BPM in text-tertiary
- Slider: teal gradient track
- Reset button: small glass pill
### Track List
- Each track: glass-subtle row
- Left: instrument emoji + name
- Right: Solo [S] and Mute [M] toggle buttons
### Export Button
- Full-width green gradient, "Export MIDI" with download icon, rounded-xl
### File Upload / Preset Selector
- Drop zone: glass + dashed gold border
- Preset grid: 2-col mobile, 3-col desktop
- Each preset: small glass card (composer small secondary, piece serif primary, duration tertiary)
## Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768-1023px (single column wider)
- Desktop: >= 1024px (two columns)
## Animation Summary
| Element | Animation | Duration | Trigger |
|---------|-----------|----------|---------|
| Background blobs | Float/scale | 20-30s loop | Always |
| Cards | Fade up | 500ms | On mount |
| Play button | Pulse glow | 2s loop | While playing |
| Key name | Crossfade | 300ms | On transpose change |
| BPM number | Slide | 200ms | On tempo change |
| Hover on cards | Brighten + lift | 300ms | On hover |
| Export complete | Toast slide in | 400ms | On export done |
| Drop zone drag | Border brighten | 200ms | On drag over |
