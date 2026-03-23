# ClassiTranspose — Classical Music Transposition Web App

## Project Overview
A browser-based web app that plays classical / public-domain MIDI files with real-time transposition and BPM control, then exports the modified result as a standard MIDI file for use in DAWs.

## Quick Commands
- `npm run dev`        — Start dev server (Vite)
- `npm run build`      — Production build
- `npm run test`       — Run tests (Vitest)
- `npm run lint`       — ESLint
- `npm run type-check` — TypeScript type checking

## Tech Stack
- React 19 + TypeScript (Vite 6)
- Zustand 5 (state management)
- Tailwind CSS 4 + Radix UI (UI primitives)
- spessasynth_lib / spessasynth_core (MIDI playback, parsing, export)
- Vitest + React Testing Library (testing)
- Vercel (deployment)

## Architecture Principles
1. **engine/ is UI-agnostic** — code in src/engine/ must NEVER import React
2. **State via Zustand only** — cross-component state flows through stores
3. **Mobile-first** — all UI starts at 375 px, then scales up
4. **Type-safe** — `any` is forbidden; every data structure has an explicit type

## Language Rule
- All code, comments, commit messages, and documentation: **English**
- All reports, PR descriptions, and conversational responses to the user: **Japanese (日本語)**

## Key References
@docs/DOMAIN_KNOWLEDGE.md
@docs/ARCHITECTURE.md
@docs/PHASE_PLAN.md
@docs/UI_SPEC.md
@docs/SOUNDFONT_GUIDE.md
