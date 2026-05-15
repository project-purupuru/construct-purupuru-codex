# Cross-Reference

Traverse entity relationships via the knowledge graph.

## Trigger

"What's related to Akane?", "Show Wuxing cycle for Wood", "Character-Puruhani pairs"

## Workflow

1. Load `_codex/data/graph.json`
2. Find all edges connected to the queried entity
3. Resolve target entities from JSONL data
4. Present relationship map

## Boundaries

- Only surfaces relationships present in graph.json
- Relationship-focused — excludes ownership, on-chain state
