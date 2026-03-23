# Project-Specific Supplement

## Reporting Language
When reporting progress, errors, decisions, or asking the user questions,
ALWAYS respond in **Japanese (日本語)**.
Code, comments, type names, variable names, and documentation files stay in English.

## Non-Negotiable Rules
- Never use `any`. Use `unknown` + type guards instead.
- Never use `export default`. Always use named exports.
- Never put React imports inside src/engine/.
- Never delete or skip a failing test to make the suite pass.
- Run `npm run type-check` after every file change.

## Commit Convention
```
<type>(<scope>): <short summary in English>
```
Types: feat, fix, refactor, test, docs, chore, style, perf
Scope: midi, audio, ui, store, export, config
