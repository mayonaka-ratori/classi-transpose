# Design System — ClassiTranspose Premium UI
## IMPORTANT — Read First
This file defines the COMPLETE visual language for ClassiTranspose.
Every component MUST follow these rules. The design is inspired by
Apple Music Classical: warm, immersive, glass-morphic, serif-accented.
---
## 1. Philosophy
- **Warm Immersion**: The app should feel like opening a beautiful vinyl sleeve
- **Glass Layers**: UI elements float on frosted glass above animated backgrounds
- **Serif Elegance**: Classical music deserves typographic respect
- **Motion with Purpose**: Every animation serves a functional or emotional role
- **Generous Whitespace**: Let elements breathe — never cramped
---
## 2. Color Tokens (Tailwind CSS v4 @theme)
### Base Palette
--color-bg-base: #FBF9F6          /* warmest white - page foundation */
--color-bg-warm-start: #F5EDE3    /* gradient start */
--color-bg-warm-end: #E8DDD0      /* gradient end */
### Glass Tokens
--color-glass-bg: rgba(255, 255, 255, 0.55)
--color-glass-bg-hover: rgba(255, 255, 255, 0.70)
--color-glass-border: rgba(255, 255, 255, 0.30)
--color-glass-border-strong: rgba(255, 255, 255, 0.50)
--color-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.06)
--color-glass-shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.10)
--color-glass-inset: inset 0 1px 0 rgba(255, 255, 255, 0.5)
### Accent Colors
--color-accent-rose: #C2185B       /* primary action - play, export */
--color-accent-rose-hover: #AD1457
--color-accent-rose-light: rgba(194, 24, 91, 0.12)
--color-accent-gold: #B8860B       /* secondary accent - classical feel */
--color-accent-gold-light: rgba(184, 134, 11, 0.10)
--color-accent-indigo: #5C6BC0     /* transpose slider */
--color-accent-indigo-light: rgba(92, 107, 192, 0.15)
--color-accent-teal: #26A69A       /* BPM slider */
--color-accent-teal-light: rgba(38, 166, 154, 0.15)
--color-accent-green: #2E7D32      /* export/success */
### Text Colors
--color-text-primary: #1C1917
--color-text-secondary: #78716C
--color-text-tertiary: #A8A29E
--color-text-on-accent: #FFFFFF
--color-text-on-glass: #292524
### Blob Colors (animated background)
--color-blob-rose: rgba(194, 24, 91, 0.10)
--color-blob-gold: rgba(184, 134, 11, 0.08)
--color-blob-indigo: rgba(92, 107, 192, 0.07)
---
## 3. Typography
### Font Stack
- **Display/Headings**: "Source Serif 4", "Noto Serif JP", ui-serif, Georgia, serif
- **UI/Body**: "Inter", "Noto Sans JP", ui-sans-serif, system-ui, sans-serif
- **Monospace (numbers)**: "JetBrains Mono", "Source Code Pro", ui-monospace, monospace
### Google Fonts Import (add to index.html <head>)
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Noto+Serif+JP:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;600&display=swap" rel="stylesheet">
### Scale
| Element | Font | Weight | Size mobile | Size desktop |
|---------|------|--------|-------------|--------------|
| App title | Source Serif 4 | 700 | 24px | 28px |
| Song title | Source Serif 4 | 600 | 20px | 26px |
| Composer | Source Serif 4 italic | 400 | 15px | 17px |
| Section label | Inter | 600 | 13px | 14px |
| Body text | Inter | 400 | 14px | 15px |
| Key name | Source Serif 4 | 600 | 18px | 22px |
| BPM number | JetBrains Mono | 500 | 16px | 18px |
| Small label | Inter | 500 | 11px | 12px |
---
## 4. Glass Card Component Pattern
Every card/panel uses this pattern:
<div className="
  bg-white/55
  backdrop-blur-xl
  backdrop-saturate-[180%]
  border border-white/30
  rounded-2xl
  shadow-[0_8px_32px_rgba(0,0,0,0.06)]
  [box-shadow:0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)]
  transition-all duration-300
  hover:bg-white/65
  hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]
  p-5 md:p-6
">
### Card Variants
- **Standard**: bg-white/55 backdrop-blur-xl (most cards)
- **Elevated**: bg-white/65 backdrop-blur-2xl (song info, main controls)
- **Subtle**: bg-white/35 backdrop-blur-lg (track list items)
- **Header/Footer**: bg-white/40 backdrop-blur-2xl (fixed position bars)
---
## 5. Animated Background Blobs
The page background has 3 animated gradient blobs placed as first children of root:
Fixed position, -z-10, pointer-events-none, overflow-hidden.
- Base layer: bg-gradient-to-br from-[#FBF9F6] via-[#F5EDE3] to-[#E8DDD0]
- Blob 1 (Rose): absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(194,24,91,0.10),transparent_70%)] blur-[80px] animate-blob-float-1
- Blob 2 (Gold): absolute top-[30%] -right-[150px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(184,134,11,0.08),transparent_70%)] blur-[100px] animate-blob-float-2
- Blob 3 (Indigo): absolute -bottom-[100px] left-[20%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(92,107,192,0.07),transparent_70%)] blur-[90px] animate-blob-float-3
---
## 6. Slider Styling
### Transpose Slider (Indigo gradient)
Track: linear-gradient(90deg, #7986CB, #5C6BC0, #3F51B5), 6px height, rounded
Thumb: 22px circle, white bg, 2px solid #5C6BC0, shadow rgba(92,107,192,0.3), hover scale 1.15
### BPM Slider (Teal gradient)
Track: linear-gradient(90deg, #4DB6AC, #26A69A, #00897B), 6px height, rounded
Thumb: 22px circle, white bg, 2px solid #26A69A, shadow rgba(38,166,154,0.3), hover scale 1.15
---
## 7. Button Patterns
### Play Button (Primary)
w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent-rose to-[#AD1457] text-white shadow-[0_4px_16px_rgba(194,24,91,0.35)] hover:scale-105 active:scale-95
### Secondary Button (Glass)
px-4 py-2 bg-white/40 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/60
### Export Button (Gradient)
w-full py-3 bg-gradient-to-r from-accent-green to-[#388E3C] text-white font-semibold rounded-xl shadow-[0_4px_16px_rgba(46,125,50,0.30)] hover:scale-[1.02]
---
## 8. Animation Keyframes (add to index.css)
@keyframes blob-float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(80px, 60px) scale(1.1); }
  66% { transform: translate(-40px, 100px) scale(0.95); }
}
@keyframes blob-float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-60px, -80px) scale(1.05); }
  66% { transform: translate(50px, -40px) scale(1.1); }
}
@keyframes blob-float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -60px) scale(1.08); }
  66% { transform: translate(-70px, 30px) scale(0.97); }
}
@keyframes card-enter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes key-crossfade {
  0% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 4px 16px rgba(194, 24, 91, 0.35); }
  50% { box-shadow: 0 4px 24px rgba(194, 24, 91, 0.55); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
---
## 9. Layout Rules
### Mobile (< 768px)
- Single column, full-width cards, padding 20px, gap 16px, border-radius 20px
- Header fixed top, glass, 56px height
### Tablet (768px - 1023px)
- Single column, max-width 640px centered, padding 24px
### Desktop (>= 1024px)
- Two-column: left 40% (song info + playback + file), right 60% (transpose + BPM + tracks + export)
- Max content width 1200px centered, padding 28px, gap 20px
### Z-Index: Background blobs -10, Content 0, Cards 10, Header 50, Modals 100
---
## 10. File Upload Area
Glass drop zone with dashed gold border (border-[#B8860B]/30), rounded-3xl, large music note icon with gold gradient bg, serif heading, sans description. Hover: border brightens, subtle scale. Drag active: border solid, bg-white/45.
---
## 11. Accessibility
- Focus rings: focus-visible:ring-2 focus-visible:ring-accent-rose/50 focus-visible:ring-offset-2
- Min contrast 4.5:1 normal text, 3:1 large text
- All sliders: aria-label, aria-valuemin, aria-valuemax, aria-valuenow
- prefers-reduced-motion: disable blob animations and card transitions
- Glass must not reduce text readability
---
## 12. Do NOT
- Use dark mode
- Use flat solid backgrounds for cards (always glass)
- Use plain <select> (use Radix UI Select with glass styling)
- Use default browser slider styling
- Skip background blobs
- Use more than 2 font families per view
- Add borders heavier than 1px on glass elements
