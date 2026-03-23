---
paths:
  - "src/components/**/*.tsx"
---

# React Component Patterns

## Structure
- Function components only — no class components
- No `export default` — always named exports
- Define props type in the same file: `type XxxProps = { ... }`
- One component per file as a rule

## Template
```tsx
import { useState, useCallback } from 'react';

type TransposeControlProps = {
  currentSemitones: number;
  onTransposeChange: (semitones: number) => void;
};

export function TransposeControl({
  currentSemitones,
  onTransposeChange,
}: TransposeControlProps) {
  // 1. hooks
  // 2. derived values
  // 3. handlers
  // 4. render
}
```

## State Management Rules
- **useState**: UI-local state only (dropdown open, hover, etc.)
- **Zustand store**: any state shared across components
- **useRef**: DOM refs, previous-value tracking, timer IDs, AudioContext
- Subscribe to the minimum slice from Zustand:
  ```tsx
  // GOOD
  const semitones = useMidiStore((s) => s.transposeSemitones);
  // BAD — triggers re-render on ANY store change
  const store = useMidiStore();
  ```

## Tailwind CSS
- When class strings are long, break across lines for readability
- Responsive order: bare (mobile) → `sm:` → `md:` → `lg:` (mobile-first)
- Use Tailwind spacing scale — avoid magic pixel values
- Use custom theme tokens for project colors

## Accessibility
- Every interactive element must have an `aria-label`
- Sliders: set `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Support keyboard navigation (Tab focus, arrow keys on sliders)
- Prefer Radix UI primitives — they handle a11y out of the box
