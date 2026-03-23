---
paths:
  - "src/**/*.test.{ts,tsx}"
  - "src/**/*.spec.{ts,tsx}"
---

# Testing Rules

## Framework
- Vitest + React Testing Library
- Test files live next to source: `foo.ts` → `foo.test.ts`

## Priority (high → low)
1. src/engine/ core logic (transpose, BPM, export) — REQUIRED
2. Zustand store state transitions — REQUIRED
3. Custom hooks — RECOMMENDED
4. Component interactions — RECOMMENDED
5. E2E (Playwright) — added in Phase 7

## Style
- Group with `describe` blocks per feature
- Test names in English: `it('transposes C major +3 semitones to E♭ major', ...)`
- Follow Arrange-Act-Assert pattern
- Minimize mocks. engine/ should be directly testable without mocks

## Web Audio in Tests
- Mock AudioContext with `standardized-audio-context-mock`
- Do NOT test actual audio output in unit tests

## Commands
- `npm run test`          — run all tests
- `npm run test:watch`    — watch mode
- `npm run test:coverage` — coverage report
