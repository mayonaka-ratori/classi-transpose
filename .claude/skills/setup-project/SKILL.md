---
name: setup-project
description: Bootstrap the ClassiTranspose project from scratch
disable-model-invocation: true
allowed-tools: Bash, Write, Read
---

# Project Initial Setup

Execute these steps in order.

## 1. Create Vite project
```bash
npm create vite@latest . -- --template react-ts
```

## 2. Install dependencies
```bash
# Core
npm install react react-dom zustand spessasynth_lib spessasynth_core

# Radix UI primitives
npm install @radix-ui/react-slider @radix-ui/react-select \
  @radix-ui/react-checkbox @radix-ui/react-toggle \
  @radix-ui/react-tooltip @radix-ui/react-dropdown-menu

# Tailwind
npm install -D tailwindcss @tailwindcss/vite

# Dev tools
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  jsdom eslint @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser eslint-plugin-react-hooks
```

## 3. Create directory structure
Build the full tree described in docs/ARCHITECTURE.md.
Place `.gitkeep` in empty directories.

## 4. Generate config files
- tsconfig.json: strict: true, path aliases (`@/` → `src/`)
- vite.config.ts: React plugin, path aliases, Tailwind plugin
- tailwind.config.ts: dark mode default, custom color tokens
- vitest config inside vite.config.ts
- .eslintrc.cjs

## 5. Create base files
- src/main.tsx: entry point
- src/App.tsx: root component (layout skeleton only)
- src/index.css: Tailwind directives + base styles (dark theme)
- All type definition files under src/types/

## 6. Verify
```bash
npm run dev
```
Open browser → confirm dark-mode header renders without errors.

Report results to the user in Japanese.
