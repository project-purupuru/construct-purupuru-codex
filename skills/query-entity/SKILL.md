# Query Entity

Deterministic entity lookups with fuzzy fallback.

## Trigger

"Who is Akane?", "Look up Sora Tower", "Find the Wood Puruhani"

## Workflow

1. Parse query for entity name/ID/slug
2. Attempt exact match via `_codex/data/*.jsonl`
3. If no match, fuzzy search via Fuse.js
4. Return structured entity data with source citation

## Boundaries

- Always cites source file and canon tier
- Never invents entities not in the codex
- Returns ENTITY_NOT_FOUND with suggestions for misses
