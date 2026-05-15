# Mission: construct-purupuru-codex

## Objective

Create `construct-purupuru-codex` — a construct-format codex for the Purupuru universe, following the pattern established by [construct-mibera-codex](https://github.com/0xHoneyJar/construct-mibera-codex).

## Source Material

- **World source**: https://github.com/project-purupuru/world-purupuru — the canonical Purupuru world repo. Extract everything: lore, characters, factions, items, locations, mechanics, art direction, narrative, technical specs.
- **Format reference**: https://github.com/0xHoneyJar/construct-mibera-codex — working example of the codex construct format. This is the model to follow.
- **Base template**: https://github.com/0xHoneyJar/construct-base — the construct base scaffolding.

## Approach

1. Study the mibera-codex structure (construct.yaml, CLAUDE.md, skills/, identity/, data/, commands/)
2. Extract all world-purupuru content into equivalent codex data layers
3. Build construct-purupuru-codex with the same structural patterns: anti-hallucination canonical data, lookup skills, identity/persona, MCP integration, etc.

## Key Notes

- Mibera-codex is the gold standard example — follow its patterns closely
- The goal is comprehensive extraction: lore, traits, collections, world-building, everything from world-purupuru gets codified
- This repo already has Loa framework mounted as a submodule from 0xHoneyJar/loa
