---
paths:
  - "src/**/*.{ts,tsx}"
---

# Code Style Rules

## TypeScript
- Strict mode enabled in tsconfig.json
- `any` is forbidden. Use `unknown` and narrow with type guards
- Always annotate return types explicitly — do not rely on inference
- Do not use `enum`. Use `as const` objects with `typeof` / `keyof`
- 2-space indentation

## Naming
- Components: PascalCase file & export (e.g. `TransposeControl.tsx`)
- Hooks: camelCase with `use` prefix (e.g. `useMidiPlayer.ts`)
- Stores: camelCase with `use` prefix (e.g. `useMidiStore.ts`)
- Types / Interfaces: PascalCase (e.g. `MidiTrack`, `TransposeState`)
- Constants: UPPER_SNAKE_CASE (e.g. `MAX_TRANSPOSE_SEMITONES`)
- Non-component files: kebab-case (e.g. `music-theory.ts`)

## Import Order
1. React / external libraries
2. Internal modules: stores → engine → components → hooks → utils → types
3. Styles / assets
Separate each group with a blank line.

## Error Handling
- Wrap every async function body in try-catch
- Surface user-facing errors via toast notifications
- Engine-layer errors use custom Error subclasses with typed `code` fields
