# Agent Working Memory (NOTES.md)

> This file persists agent context across sessions and compaction cycles.
> Updated automatically by agents. Manual edits are preserved.

## Active Sub-Goals
<!-- Current objectives being pursued -->
- Sprint plan v1.0 complete at grimoires/loa/sprint.md -- 5 sprints planned for v1 codex
- Next: /build (or /run sprint-plan) to begin Sprint 1: Foundation & Schema

## Discovered Technical Debt
<!-- Issues found during implementation that need future attention -->

## Blockers & Dependencies
<!-- External factors affecting progress -->

## Session Continuity
<!-- Key context to restore on next session -->
| Timestamp | Agent | Summary |
|-----------|-------|---------|

## Decision Log
<!-- Major decisions with rationale -->
| Timestamp | Agent | Decision | Rationale |
|-----------|-------|----------|-----------|
| 2026-05-14 | architect | Static knowledge base pattern (not web app) | PRD specifies read-only reference, pre-computed indices, no runtime state |
| 2026-05-14 | architect | TypeScript + Node.js 22 LTS for MCP server | Type safety for schema validation; MCP SDK is TypeScript-first; LTS stability |
| 2026-05-14 | architect | File-based storage (no database) | Entities are static markdown + JSONL exports; matches construct-format pattern from mibera-codex |
| 2026-05-14 | architect | Fuse.js for fuzzy search | Lightweight, no external deps, client-side; fits sub-second lookup requirement |
| 2026-05-14 | architect | 5-sprint phased approach | Foundation > Extraction > Exports > MCP Server > Validation; each phase buildable independently |
