---
name: test-and-fix
description: Run the full test suite and fix any failures
disable-model-invocation: true
allowed-tools: Read, Write, Bash, Grep
---

# Test → Fix Cycle

## Step 1 — Run all tests
```bash
npm run test -- --reporter=verbose 2>&1
```

## Step 2 — Type check
```bash
npm run type-check 2>&1
```

## Step 3 — Lint
```bash
npm run lint 2>&1
```

## Step 4 — Analyze & Fix
If any step fails:
1. Read the error message and identify root cause
2. Open the relevant file and fix the issue
3. Re-run Steps 1-3
4. Repeat until everything passes

## Hard Rules
- NEVER delete or `.skip` a failing test to make the suite green
- Only modify test expectations if the test itself is wrong
- NEVER use `as any` or `@ts-ignore` to silence type errors — fix the actual type

Report results to the user in Japanese.
