---
name: add-feature
description: Add a new feature to ClassiTranspose following the standard workflow
disable-model-invocation: true
argument-hint: [feature-name]
allowed-tools: Read, Write, Bash, Grep, Glob
---

# Add Feature Workflow: $ARGUMENTS

## Step 1 — Research
1. Read `docs/PHASE_PLAN.md` to locate which phase this feature belongs to
2. Read `docs/ARCHITECTURE.md` for relevant data flows
3. Scan existing code to identify files that need changes

## Step 2 — Design Check
1. Add or update type definitions in `src/types/`
2. Identify required Zustand store changes (new state / actions)
3. Determine whether engine/ changes are needed

## Step 3 — Implement (bottom-up)
1. **Types** first
2. **Engine layer** logic (no React dependency)
3. **Unit tests** for engine layer
4. **Store** state / actions
5. **Components** (UI)
6. **Responsive check** (mobile → desktop)

## Step 4 — Validate
```bash
npm run test
npm run type-check
npm run lint
```

## Step 5 — Manual QA
```bash
npm run dev
```
Open browser, test the feature manually at 375 px width.

## Rules
- engine/ must NOT import anything from React
- `any` is forbidden
- All component props must be typed
- UI must not break at 375 px width

Report results to the user in Japanese.
