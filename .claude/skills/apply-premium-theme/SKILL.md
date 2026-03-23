# Skill: Apply Premium Theme
## Description
Transform ClassiTranspose from basic light theme to Apple Music Classical-inspired
premium design with glassmorphism, animated blobs, and serif typography.
## Reference
Read .claude/rules/design-system.md and docs/UI_SPEC.md thoroughly before starting.
Follow them precisely.
## Steps
### Step 1: Update index.html
Add Google Fonts in <head> (Source Serif 4, Inter, Noto Serif JP, Noto Sans JP).
### Step 2: Rewrite src/index.css
Complete rewrite with:
- Tailwind v4 @theme block defining all color tokens from design-system.md
- Custom font-family definitions
- All @keyframes from design-system.md section 8
- Custom slider styles for transpose (indigo) and BPM (teal)
- Animation utility classes (.animate-blob-float-1, .animate-blob-float-2, .animate-blob-float-3, .animate-card-enter, .animate-key-change, .animate-pulse-glow, .animate-shimmer)
- Stagger classes (.stagger-1 through .stagger-5 with animation-delay 0s to 0.4s)
- Reduced motion media query: disable all animations
- Base body style: font-family Inter, background bg-base color
### Step 3: Create src/components/layout/AmbientBackground.tsx
New component rendering the 3 animated gradient blobs.
- Fixed position, -z-10, pointer-events-none, overflow-hidden
- Base warm gradient layer (bg-gradient-to-br from-[#FBF9F6] via-[#F5EDE3] to-[#E8DDD0])
- 3 blob divs per design-system.md section 5
- Respect prefers-reduced-motion (use useMediaQuery or CSS)
### Step 4: Update src/components/layout/Header.tsx
- Glass header: bg-white/40 backdrop-blur-2xl border-b border-white/20
- App title in Source Serif 4 weight 700 with gold music note icon
- Sticky top-0 z-50
- Right side: quality toggle badge
### Step 5: Update src/components/file/FileUploader.tsx
- Glass drop zone with dashed gold border per design-system.md section 10
- Large musical note icon with gold gradient background
- Serif heading, sans description
- Drag state: border brightens, subtle scale
### Step 6: Update src/components/controls/PlayerControl.tsx
- Large circular play button with rose gradient per design-system.md section 7
- Add pulse-glow animation when isPlaying is true
- Glass skip buttons
- Monospace time display
- Custom seek bar with gradient fill
### Step 7: Update src/components/controls/TransposeControl.tsx
- Wrap in glass card
- "TRANSPOSE" uppercase section label
- Large serif key name display
- Custom indigo gradient slider per design-system.md section 6
- Glass -/+ buttons
### Step 8: Update src/components/controls/BpmControl.tsx
- Wrap in glass card
- "TEMPO" section label
- Monospace percentage + serif BPM
- Custom teal gradient slider per design-system.md section 6
- Glass reset pill button
### Step 9: Update src/components/layout/MobileLayout.tsx
- Add AmbientBackground as first child
- Wrap each section in glass card divs per design-system.md section 4
- Add staggered card-enter animations (stagger-1, stagger-2, etc.)
- At lg: breakpoint, switch to two-column grid layout per design-system.md section 9
### Step 10: Update src/App.tsx
- Remove any dark mode classes
- Ensure AmbientBackground is rendered at root level
- Clean minimal wrapper
### Step 11: Verify
Run: npm run type-check && npm run lint && npm run test && npm run dev
Open http://localhost:5173 and confirm:
- Warm cream background with floating animated blobs
- All cards use glassmorphism (translucent, blurred, rounded)
- Serif font for titles, sans for UI, mono for numbers
- Custom gradient sliders
- Circular rose gradient play button
- Responsive layout works at mobile and desktop widths
- All existing functionality (playback, transpose, BPM) still works
## Quality Checklist
- [ ] No dark: classes anywhere
- [ ] All cards use glassmorphism
- [ ] Background blobs visible and animated
- [ ] Serif font loads for titles
- [ ] Monospace for BPM/time numbers
- [ ] Sliders have custom gradient styling
- [ ] Play button circular with rose gradient
- [ ] Cards have staggered entrance animation
- [ ] prefers-reduced-motion disables animations
- [ ] All existing functionality preserved
- [ ] TypeScript 0 errors
- [ ] Lint 0 warnings
- [ ] Tests all pass
## Reporting Language
Report progress and results in Japanese.
