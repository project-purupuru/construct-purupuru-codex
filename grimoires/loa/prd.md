# Product Requirements Document: construct-purupuru-codex

> Generated: 2026-05-14
> Status: Draft
> Sources: mission.md, Phase 1-2 interview, world-purupuru repo analysis, construct-mibera-codex structural analysis

---

## 1. Problem Statement

The Purupuru universe — a game world and creative IP spanning lore, characters, locations, game mechanics, design systems, and NFT elements — has accumulated 362+ files (~1,900 KB) of content across `world-purupuru`. This content exists as unstructured markdown, YAML, and JSON with varying canonical authority but no unified query interface.

AI agents building on the Purupuru universe hallucinate details. Developers integrating Purupuru data lack a structured API. Community members have no canonical lookup surface. The world is actively growing, integrations are coming, and content needs formalization before it fragments.

> Sources: mission.md:1-23, Phase 1 Q1-Q3, Phase 2 Q2

### Why Now

- **Active development**: The world is growing across multiple sessions (93+ session tracks, sessions 15-81+)
- **Integration need**: Multiple consumers planned (AI agents, game clients, community tools) — none locked yet
- **Preservation**: Content must be codified before canonical authority erodes across 362+ scattered files

> Sources: Phase 1 Q3, Phase 2 Q2

---

## 2. Product Vision

Build `construct-purupuru-codex` — a construct-format codex that serves as the canonical, queryable source of truth for the Purupuru universe. Follow the structural patterns established by `construct-mibera-codex`: anti-hallucination canonical data, lookup skills, identity/persona, and MCP integration.

The codex transforms scattered world-building documents into a machine-readable, agent-consumable, human-browsable knowledge base.

> Sources: mission.md:3-5, mission.md:15-17

---

## 3. Users & Stakeholders

| Persona | Need | How They Use the Codex |
|---------|------|------------------------|
| **AI Agents** | Canonical data to avoid hallucination when narrating/building within Purupuru | MCP tools for deterministic lookups, validation of world elements |
| **Developers** | Structured reference data for integrating Purupuru into apps/games/tools | JSONL/JSON exports, CLI lookups, schema definitions |
| **Community** | Lore lookup, character exploration, world discovery | Browse skills, cross-reference navigation, human-readable entity pages |

> Sources: Phase 1 Q2, Phase 2 Q2

---

## 4. Success Criteria

| Metric | Target |
|--------|--------|
| Core entity coverage | 100% of canonical characters, Puruhani, locations, Jani variants extracted |
| Data format parity | JSONL + JSON exports matching mibera-codex patterns |
| Skill coverage | Browse, query-entity, cross-reference skills operational |
| Anti-hallucination | Canonical validation tool rejects fabricated entities |
| MCP integration | Stdio-based MCP server with lookup/validate/search tools |
| Canon integrity | Four-tier authority model (Canonical > Established > Exploratory > Speculative) enforced |

**v1 = Core categories complete**: Characters (5), Puruhani (5), Locations (19+), Jani (13 variants), Wuxing elements (5), core lore. Expand from there.

> Sources: Phase 2 Q1, world-purupuru gaps/gaps.md

---

## 5. Functional Requirements

### 5.1 Data Layer — Entity Extraction

Extract all canonical entities from `world-purupuru` into structured codex format:

| Entity Type | Count | Source Location | Priority |
|-------------|-------|-----------------|----------|
| Characters (KIZUNA) | 5 | `entities/characters/` | P0 |
| Puruhani | 5 | `entities/puruhani/` | P0 |
| Locations (Horai) | 19+ | `entities/locations/` | P0 |
| Jani & Variants | 13 | `entities/jani/` | P0 |
| Wuxing Elements | 5 | `ontology.yaml`, `wuxing.yaml` | P0 |
| Cards | 168 (schema, 10 seed) | `data/cards-schema.yaml` | P1 |
| Game Mechanics | — | `dna/battle-dna.md`, `game-design-document.md` | P1 |
| Design Tokens | — | `dna/taste.md`, `visual-effects-bible.md` | P2 |
| Decision Records | 41 | `decisions/` | P2 |
| Specifications | 82 | `specs/` | P3 |

Each entity page follows a consistent schema (analogous to mibera-codex's per-Mibera pages):
- Structured frontmatter (YAML)
- Canonical fields (name, element, archetype, relationships, lore)
- Cross-reference backlinks (auto-generated)

### 5.2 Knowledge Organization — Dimensional Model

Adapted from mibera-codex's 7-dimension model to Purupuru's natural axes:

| Dimension | Description | Analogous Mibera Dimension |
|-----------|-------------|---------------------------|
| **Element** | Wood, Earth, Fire, Metal, Water (+ Harmony) | Element |
| **Generation** | KIZUNA (current), MIRAI, TENSEI (future) | Era |
| **Entity Type** | Character, Puruhani, Jani, Location, Card | (structural) |
| **District** | Horai Surface, Old Horai, broader Tsuheji | (geographic) |
| **Canon Tier** | Canonical, Established, Exploratory, Speculative | (authority) |
| **Rarity** | Common, Uncommon, Rare, Rarest (cards) | Swag Rank |

### 5.3 Skills

Three core skills mirroring mibera-codex's pattern:

#### browse-codex
- Navigate entities by dimension (element, generation, district, entity type, canon tier)
- Browse indices listing entities per dimension value
- Cross-dimensional analysis (e.g., "all Fire entities in Horai Surface")

#### query-entity
- Deterministic lookups by name, ID, or slug
- Fuzzy intent search for conceptual queries
- Field extraction for specific attributes
- CLI tool as authoritative interface (not filesystem)

#### cross-reference
- Element cycle relationships (Wuxing Sheng/Ke chains)
- Character-Puruhani pairings
- Location-element affinities
- Card-character associations
- Knowledge graph traversal

### 5.4 Anti-Hallucination System

- `validate_world_element()` — canonical fact-checking against codex data
- Coverage-gap tracking (mirroring world-purupuru's `gaps/gaps.md`)
- Canon tier enforcement — speculative content clearly marked, never presented as canonical
- Source verification — always cite codex file path, never fabricate

### 5.5 MCP Server (codex-mcp)

Stdio-based Model Context Protocol server providing:

| Tool | Description |
|------|-------------|
| `lookup_character(name)` | Character data by name |
| `lookup_puruhani(element)` | Puruhani by element |
| `lookup_location(slug)` | Location details |
| `lookup_jani(variant)` | Jani variant info |
| `lookup_element(name)` | Wuxing element data + cycle relationships |
| `lookup_card(id)` | Card data by ID |
| `validate_world_element(claim)` | Canonical fact-checking |
| `search(query)` | Fuzzy intent search across all entities |
| `list(entity_type)` | Enumerate entities by type |

### 5.6 Identity System

#### Persona: Purupuru Oracle

Adapted from mibera-codex's "Mibera Oracle" pattern:
- **Role**: Librarian first, oracle second — precise, sourced, humble about limits
- **Voice**: Plain-spoken precision, then poetic reframing. Cites sources. Welcomes all knowledge levels.
- **Cognitive frame**: Caretaker of the Purupuru world's canonical truth

#### Knowledge Books (adapted from mibera-codex's 7-book system)

| Book | Domain | Content |
|------|--------|---------|
| I. Genesis | Origin & Philosophy | Lore-bible, Tsuheji creation, HENLO ethos, honey magic origin |
| II. Elements | Wuxing System | Five elements, Sheng/Ke cycles, cosmic weather, element affinities |
| III. Beings | Living Entities | Characters (KIZUNA), Puruhani, Jani & variants |
| IV. Places | World Geography | Horai Surface, Old Horai, Tsuheji topology, Seven Rooms |
| V. The Game | Mechanics & Cards | Battle system, card schema, synergies, transcendence |
| VI. The Art | Design Language | Taste tokens, visual effects, motion philosophy, product principles |
| VII. The Record | Data & Schemas | JSONL/JSON exports, ECS schema, ontology, card-schema |

#### Constraints (what the Oracle does NOT do)
- Track ownership, wallets, prices, or blockchain state
- Invent entities, pairings, or lore not in the codex
- Present speculative content as canonical
- Develop content in intentionally-gapped areas (GAP-001 through GAP-010+) without authorization
- Violate generational scope (MIRAI/TENSEI are deliberately undeveloped)

### 5.7 Machine-Readable Exports (_codex/data/)

| Export | Format | Content |
|--------|--------|---------|
| `characters.jsonl` | JSONL | All KIZUNA characters |
| `puruhani.jsonl` | JSONL | All Puruhani entities |
| `locations.jsonl` | JSONL | All Horai locations |
| `jani.jsonl` | JSONL | All Jani variants |
| `cards.jsonl` | JSONL | Card data (seed → full 168) |
| `wuxing.json` | JSON | Element system + cycle relationships |
| `graph.json` | JSON | Knowledge graph (all entity relationships) |
| `ontology.json` | JSON | Machine-readable ontology (from ontology.yaml) |
| `gaps.json` | JSON | Coverage gap tracking |
| `scope.json` | JSON | Project scope definition |

---

## 6. Technical & Non-Functional Requirements

### 6.1 Construct Format Compliance

Must conform to `construct-base` structure:
- `construct.yaml` — manifest declaring skills, commands, identity, MCP
- `CLAUDE.md` — runtime identity injection (Oracle system prompt)
- `identity/persona.yaml` — cognitive frame & voice
- `identity/expertise.yaml` — domain expertise (7-book system)
- `identity/ORACLE.md` — comprehensive identity synthesis
- `skills/` — browse-codex, query-entity, cross-reference
- `commands/` — slash command routing
- `_codex/data/` — machine-readable exports
- `.github/workflows/validate.yml` — three-level CI validation

### 6.2 Canon Integrity

- Four-tier authority model inherited from world-purupuru governance
- `lore-bible.md` is binding truth — overwrites all other sources
- Manifest restrictions enforced (cannot invent Puruhani names, etc.)
- Gap tracking (14 documented gaps preserved and surfaced)

### 6.3 Performance

- Entity lookups: deterministic, sub-second
- Browse indices: pre-computed, not dynamic
- Knowledge graph: JSON export for offline analysis
- MCP server: stdio-based, lightweight

### 6.4 Data Integrity

[ASSUMPTION] Anti-hallucination validation covers all entity types, not just a subset.

- Source tracing: every codex entry traces to world-purupuru source file
- No fabrication: codex never contains data not grounded in source material
- Gap honesty: missing data acknowledged, never filled with invention

---

## 7. Scope & Prioritization

### v1 (Core Categories)

- Characters (5 KIZUNA) + Puruhani (5) + Locations (19+) + Jani (13 variants)
- Wuxing element system + cycle relationships
- Core lore (lore-bible, topology, ontology)
- construct.yaml + CLAUDE.md + identity system
- Three core skills (browse, query, cross-reference)
- JSONL/JSON exports for core entities
- MCP server with core lookup tools
- Anti-hallucination validation

### v2 (Expanded)

- Cards (168 full roster when art available)
- Game mechanics codification (battle system, synergies)
- Design tokens (taste system, visual effects)
- Decision record archive
- Knowledge graph (full entity relationship mapping)
- CLI tool (purucodex)

### v3 (Deep)

- Specification archive (82 docs)
- Research archive
- Session track archive
- Extended Jani lore
- Broader Tsuheji geography (when GAP-001 resolves)

### Explicitly Out of Scope

- MIRAI/TENSEI generation content (intentionally undeveloped per world-purupuru governance)
- Puruhani individual names (blocked by GAP-002)
- On-chain state tracking (ownership, wallets, prices)
- Live game server infrastructure
- Content generation (codex is read-only reference, not a generator)

---

## 8. Risks & Dependencies

| Risk | Impact | Mitigation |
|------|--------|------------|
| world-purupuru content evolves during extraction | Codex drifts from source | Pin extraction to specific commit; document source commit hash |
| Canon tier ambiguity for edge-case content | Speculative content mistakenly canonized | Enforce four-tier model; when in doubt, mark Exploratory |
| 168-card roster blocked by GAP-004 | Cards section incomplete at v1 | Card schema ready; populate as art becomes available |
| Mibera-codex patterns don't map cleanly | Structural awkwardness | Adapt rather than force — Purupuru's dimensions differ from Mibera's |
| Large source corpus (362+ files) overwhelms extraction | Incomplete or inconsistent codex | Prioritize P0 core entities; use templates for consistency |

### External Dependencies

- `construct-base` — base template scaffolding
- `world-purupuru` — source material (actively maintained by @gumi)
- `construct-mibera-codex` — structural reference (read-only)

---

## 9. Content Extraction Map

### Source → Codex Mapping

| world-purupuru Source | Codex Destination | Transform |
|----------------------|-------------------|-----------|
| `entities/characters/*.md` | `characters/*.md` + `characters.jsonl` | Restructure to codex entity schema |
| `entities/puruhani/*.md` | `puruhani/*.md` + `puruhani.jsonl` | Restructure to codex entity schema |
| `entities/locations/*.md` | `locations/*.md` + `locations.jsonl` | Restructure to codex entity schema |
| `entities/jani/*.md` | `jani/*.md` + `jani.jsonl` | Restructure to codex entity schema |
| `lore-bible.md` | `core-lore/lore-bible.md` | Direct copy (canonical) |
| `ontology.yaml` | `core-lore/ontology.yaml` + `ontology.json` | Copy + JSON export |
| `dna/taste.md` | `core-lore/design-language.md` | Restructure for codex consumption |
| `data/cards-schema.yaml` | `cards/schema.yaml` + `cards.jsonl` | Copy + JSONL generation |
| `data/wuxing.yaml` | `core-lore/wuxing.yaml` + `wuxing.json` | Copy + JSON export |
| `topology.md` | `core-lore/topology.md` | Direct copy |
| `dna/battle-dna.md` | `mechanics/battle-system.md` | Restructure for codex |
| `gaps/gaps.md` | `_codex/data/gaps.json` | Parse to structured JSON |
| `oracle/*` | `oracle/*` | Adapt for codex oracle config |
| `_templates/*` | Reference only | Inform codex entity schemas |

---

## Appendix: Construct Structure Target

```
construct-purupuru-codex/
├── construct.yaml              # Manifest
├── CLAUDE.md                   # Oracle system prompt
├── IDENTITY.md                 # Persona embodiment framework
├── identity/
│   ├── persona.yaml            # Cognitive frame & voice
│   ├── expertise.yaml          # 7-book domain expertise
│   └── ORACLE.md               # Identity synthesis
├── skills/
│   ├── browse-codex/
│   │   ├── index.yaml
│   │   └── SKILL.md
│   ├── query-entity/
│   │   ├── index.yaml
│   │   └── SKILL.md
│   └── cross-reference/
│       ├── index.yaml
│       └── SKILL.md
├── commands/
│   └── *.md                    # Slash command routing
├── core-lore/
│   ├── lore-bible.md           # Canonical binding truth
│   ├── ontology.yaml           # Entity model
│   ├── topology.md             # World architecture
│   ├── wuxing.yaml             # Element system
│   └── design-language.md      # Taste tokens & visual DNA
├── characters/                 # KIZUNA generation (5)
├── puruhani/                   # Sentient honey beings (5)
├── locations/                  # Horai + Old Horai (19+)
├── jani/                       # Mascot & 13 variants
├── cards/                      # Card data & schema
├── mechanics/                  # Game systems
├── browse/                     # Dimension-based navigation indices
├── oracle/                     # Query interface config
├── _codex/
│   └── data/
│       ├── characters.jsonl
│       ├── puruhani.jsonl
│       ├── locations.jsonl
│       ├── jani.jsonl
│       ├── cards.jsonl
│       ├── wuxing.json
│       ├── graph.json
│       ├── ontology.json
│       ├── gaps.json
│       └── scope.json
├── src/                        # MCP server source
├── scripts/                    # Automation & generation
└── .github/
    └── workflows/
        └── validate.yml        # Three-level CI
```
