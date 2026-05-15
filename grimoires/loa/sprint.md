# Sprint Plan: construct-purupuru-codex

**Version:** 1.0
**Date:** 2026-05-14
**Author:** Sprint Planner Agent
**PRD Reference:** grimoires/loa/prd.md
**SDD Reference:** grimoires/loa/sdd.md

---

## Executive Summary

Build the canonical, queryable Purupuru universe codex as a construct-format knowledge base. The v1 scope covers ~47 core entities (5 characters, 5 Puruhani, 19+ locations, 13 Jani variants, 5 Wuxing elements), three construct skills, a stdio-based MCP server with 9 tools, JSONL/JSON exports, and a three-level CI validation pipeline with anti-hallucination guarantees.

> From prd.md: "v1 = Core categories complete: Characters (5), Puruhani (5), Locations (19+), Jani (13 variants), Wuxing elements (5), core lore." (prd.md:L60)

**Total Sprints:** 5
**Sprint Duration:** 2.5 days each
**Estimated Completion:** 2026-05-27

---

## PRD Goals

Goals auto-assigned from PRD Success Criteria (prd.md:L49-61):

| ID | Goal | Measurement | Validation Method |
|----|------|-------------|-------------------|
| G-1 | Core entity coverage | 100% of canonical characters, Puruhani, locations, Jani variants extracted | Entity count vs. PRD targets |
| G-2 | Data format parity | JSONL + JSON exports matching mibera-codex patterns | Export file existence + schema validation |
| G-3 | Skill coverage | browse, query-entity, cross-reference skills operational | Skill invocation test per skill |
| G-4 | Anti-hallucination | Canonical validation tool rejects fabricated entities | validate_world_element returns INCORRECT for known-false claims |
| G-5 | MCP integration | Stdio-based MCP server with lookup/validate/search tools | MCP server responds to all 9 tool calls |
| G-6 | Canon integrity | Four-tier authority model enforced | Schema validation rejects invalid canon_tier values |

---

## Sprint Overview

| Sprint | Theme | Scope | Key Deliverables | Dependencies |
|--------|-------|-------|------------------|--------------|
| 1 | Foundation & Schema | MEDIUM (6 tasks) | Construct scaffolding, JSON Schemas, identity system, TypeScript project, directory structure | None |
| 2 | Entity Extraction | LARGE (8 tasks) | All P0 entity pages with validated frontmatter from world-purupuru | Sprint 1 |
| 3 | Exports & Browse Indices | MEDIUM (6 tasks) | JSONL/JSON exports, browse dimension indices, knowledge graph | Sprint 2 |
| 4 | MCP Server & Skills | LARGE (8 tasks) | Working MCP server with 9 tools, three construct skills, command routing | Sprint 3 |
| 5 | Validation, Polish & E2E | MEDIUM (6 tasks) | Three-level CI, anti-hallucination hardening, Oracle identity, E2E goal validation | Sprint 4 |

---

## Sprint 1: Foundation & Schema

**Duration:** 2.5 days
**Dates:** 2026-05-14 - 2026-05-16

### Sprint Goal
Establish the construct-format repository skeleton with validated entity schemas, identity system, and TypeScript project infrastructure.

### Deliverables
- [ ] Valid `construct.yaml` manifest declaring skills, commands, identity, MCP
- [ ] JSON Schema definitions for all 6 entity types (base + character + puruhani + location + jani + element)
- [ ] Identity system files (`identity/persona.yaml`, `identity/expertise.yaml`, `identity/ORACLE.md`)
- [ ] TypeScript project configured with pnpm, tsconfig, Biome, Vitest
- [ ] Complete directory tree matching PRD Appendix structure (prd.md:L315-366)
- [ ] Schema validation script passing against sample frontmatter

### Acceptance Criteria
- [ ] `construct.yaml` parses as valid YAML and declares at minimum: name, version, skills, commands, identity
- [ ] Each JSON Schema validates at least one sample entity document without errors
- [ ] `pnpm install` succeeds; `pnpm run lint` passes; `pnpm test` runs (even with 0 tests initially)
- [ ] All directories from PRD Appendix exist (`characters/`, `puruhani/`, `locations/`, `jani/`, `core-lore/`, `cards/`, `mechanics/`, `browse/`, `oracle/`, `_codex/data/`, `src/`, `scripts/`, `skills/`, `commands/`, `identity/`)
- [ ] `identity/persona.yaml` contains Purupuru Oracle cognitive frame with voice and constraints
- [ ] `identity/expertise.yaml` defines 7-book knowledge system (prd.md:L158-167)

### Technical Tasks

- [ ] Task 1.1: Initialize construct-base scaffolding — create `construct.yaml` with name, version, description, skills array, commands array, identity config, and MCP server config -> **[G-3, G-5]**
- [ ] Task 1.2: Define JSON Schema files — create `schemas/base-entity.schema.json`, `schemas/character.schema.json`, `schemas/puruhani.schema.json`, `schemas/location.schema.json`, `schemas/jani.schema.json`, `schemas/element.schema.json` per SDD section 3.2 -> **[G-6]**
- [ ] Task 1.3: Create identity system — write `identity/persona.yaml` (Purupuru Oracle role, voice, cognitive frame), `identity/expertise.yaml` (7-book system from prd.md:L158-167), `identity/ORACLE.md` (identity synthesis) -> **[G-3]**
- [ ] Task 1.4: Set up TypeScript project — `package.json` with pnpm, `tsconfig.json` targeting ES2022/Node22, Biome 2.0.x config, Vitest 3.1.x config, tsup 8.x build config -> **[G-5]**
- [ ] Task 1.5: Create full directory structure — all directories from PRD Appendix (prd.md:L315-366) including `_codex/data/`, `browse/by-element/`, `browse/by-generation/`, `browse/by-type/`, `browse/by-district/`, `browse/by-canon-tier/`, `browse/by-rarity/` -> **[G-1, G-2]**
- [ ] Task 1.6: Create `scripts/validate-schema.ts` — validates YAML frontmatter of any entity markdown file against its JSON Schema; includes initial Vitest tests with sample frontmatter fixtures -> **[G-6]**

### Dependencies
- None (first sprint)

### Security Considerations
- **Trust boundaries**: All data is local filesystem; no external inputs at this stage
- **External dependencies**: TypeScript toolchain (pnpm, Vitest, Biome, tsup) pinned to exact versions in package.json
- **Sensitive data**: None

### Risks & Mitigation
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| construct-base structure unknown or outdated | Low | Medium | Reference construct-mibera-codex directly for structure patterns |
| JSON Schema complexity for nested entity relationships | Medium | Low | Start with required fields only; extend schemas in Sprint 2 as real data surfaces |

### Success Metrics
- 6/6 JSON Schema files pass self-validation (meta-schema check)
- `pnpm install && pnpm run lint && pnpm test` exits 0
- `scripts/validate-schema.ts` validates 3+ sample frontmatter fixtures

---

## Sprint 2: Entity Extraction

**Duration:** 2.5 days
**Dates:** 2026-05-17 - 2026-05-19

### Sprint Goal
Extract all P0 entities from `world-purupuru` into structured codex pages with validated YAML frontmatter, pinned to a specific source commit.

### Deliverables
- [ ] 5 KIZUNA character pages in `characters/*.md` with complete frontmatter
- [ ] 5 Puruhani pages in `puruhani/*.md` with complete frontmatter
- [ ] 19+ Horai location pages in `locations/*.md` with complete frontmatter
- [ ] 13 Jani variant pages in `jani/*.md` with complete frontmatter
- [ ] 5 Wuxing element entries in `core-lore/wuxing.yaml`
- [ ] Canonical lore documents copied (`lore-bible.md`, `topology.md`, `ontology.yaml`)
- [ ] Extraction script (`scripts/extract.ts`) producing all entity pages
- [ ] All entity frontmatter passing schema validation

### Acceptance Criteria
- [ ] Character pages: 5 files in `characters/`, each with id, name, slug, entity_type, canon_tier, element, generation, archetype, puruhani_partner, source_file, source_commit frontmatter fields
- [ ] Puruhani pages: 5 files in `puruhani/`, each with character_partner cross-reference
- [ ] Location pages: 19+ files in `locations/`, each with district and parent_location fields
- [ ] Jani pages: 13 files in `jani/`, each with variant_number and is_base fields
- [ ] `core-lore/wuxing.yaml` contains all 5 elements with sheng/ke cycle relationships
- [ ] `core-lore/lore-bible.md` is byte-for-byte copy from world-purupuru source
- [ ] `scripts/validate-schema.ts` passes against 100% of extracted entity frontmatter
- [ ] Every entity page includes `source_commit` field matching pinned extraction commit

### Technical Tasks

- [ ] Task 2.1: Determine and pin source commit — identify the `world-purupuru` commit hash to use for v1 extraction; document in `_codex/data/scope.json` stub -> **[G-6]**
- [ ] Task 2.2: Create `scripts/extract.ts` — TypeScript extraction pipeline using `gray-matter` for frontmatter parsing and `yaml` for YAML source files; reads world-purupuru entities and produces codex-format markdown pages -> **[G-1]**
- [ ] Task 2.3: Extract 5 KIZUNA characters — parse `world-purupuru/entities/characters/*.md`, transform to codex entity schema, write to `characters/*.md` -> **[G-1]**
- [ ] Task 2.4: Extract 5 Puruhani — parse `world-purupuru/entities/puruhani/*.md`, transform with character_partner cross-references, write to `puruhani/*.md` -> **[G-1]**
- [ ] Task 2.5: Extract 19+ Horai locations — parse `world-purupuru/entities/locations/*.md`, assign district values (horai-surface/old-horai/tsuheji), resolve parent_location references, write to `locations/*.md` -> **[G-1]**
- [ ] Task 2.6: Extract 13 Jani variants — parse `world-purupuru/entities/jani/*.md`, assign variant_number and is_base, write to `jani/*.md` -> **[G-1]**
- [ ] Task 2.7: Extract Wuxing elements and core lore — create `core-lore/wuxing.yaml` with Sheng/Ke cycles; copy `lore-bible.md`, `topology.md`, `ontology.yaml` from source -> **[G-1, G-6]**
- [ ] Task 2.8: Run full schema validation — execute `scripts/validate-schema.ts` against all extracted entities; fix any validation errors -> **[G-6]**

### Dependencies
- Sprint 1: JSON Schema definitions (Task 1.2), directory structure (Task 1.5), validation script (Task 1.6)
- External: Access to `world-purupuru` repository content

### Security Considerations
- **Trust boundaries**: `world-purupuru` source files are trusted (maintained by @gumi); extraction script reads only, never writes back
- **External dependencies**: `gray-matter`, `yaml` npm packages added — pin to exact versions
- **Sensitive data**: None — all content is public world-building lore

### Risks & Mitigation
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| world-purupuru content evolves during extraction | High | Medium | Pin to specific commit hash; document hash in every entity's source_commit field |
| Puruhani individual names blocked by GAP-002 | High | Medium | Use element-based slugs (e.g., puruhani-wood); mark as established tier; update when GAP-002 resolves |
| Source file format varies across entity types | Medium | Medium | Build per-type extractors in extract.ts; log parse warnings; manual review for edge cases |
| Character names not finalized | Medium | High | Confirm with @gumi before extraction; use SDD open question resolution (sdd.md:L1234) |

### Success Metrics
- 47+ entity pages created (5 + 5 + 19 + 13 + 5 elements in wuxing.yaml)
- 100% schema validation pass rate across all entity frontmatter
- Every entity traces to source_file and source_commit

---

## Sprint 3: Exports & Browse Indices

**Duration:** 2.5 days
**Dates:** 2026-05-20 - 2026-05-22

### Sprint Goal
Generate all machine-readable JSONL/JSON exports and pre-computed browse dimension indices from extracted entity pages.

### Deliverables
- [ ] JSONL exports: `characters.jsonl`, `puruhani.jsonl`, `locations.jsonl`, `jani.jsonl` in `_codex/data/`
- [ ] JSON exports: `wuxing.json`, `ontology.json`, `gaps.json`, `scope.json` in `_codex/data/`
- [ ] Knowledge graph: `_codex/data/graph.json` with all entity relationships as adjacency list
- [ ] Browse indices: `browse/by-element/*.md`, `browse/by-generation/*.md`, `browse/by-type/*.md`, `browse/by-district/*.md`, `browse/by-canon-tier/*.md`
- [ ] Export generation script (`scripts/generate-exports.ts`)
- [ ] Index generation script (`scripts/generate-indices.ts`)

### Acceptance Criteria
- [ ] Each JSONL file contains one valid JSON object per line; line count matches entity count (characters: 5, puruhani: 5, locations: 19+, jani: 13)
- [ ] `wuxing.json` contains all 5 elements with complete sheng_generates, sheng_generated_by, ke_overcomes, ke_overcome_by fields and entity lists
- [ ] `graph.json` adjacency list resolves: every referenced entity ID exists as a node
- [ ] `gaps.json` lists 14+ documented gaps from world-purupuru `gaps/gaps.md`
- [ ] `scope.json` contains entity counts matching actual extracted counts
- [ ] Browse index `browse/by-element/wood.md` lists all Wood-aligned entities across all types
- [ ] Each browse dimension has index files for every valid dimension value (e.g., 5 element files, 3 district files)
- [ ] Vitest snapshot tests pass for all generated exports

### Technical Tasks

- [ ] Task 3.1: Create `scripts/generate-exports.ts` — reads entity markdown files, extracts frontmatter, writes JSONL files (one JSON object per line) for characters, puruhani, locations, jani -> **[G-2]**
- [ ] Task 3.2: Generate JSON exports — produce `wuxing.json` (element system with full cycle data), `ontology.json` (from ontology.yaml), `gaps.json` (parsed from gaps.md), `scope.json` (entity counts + version) -> **[G-2]**
- [ ] Task 3.3: Generate `graph.json` — build knowledge graph as adjacency list from all entity cross_references; validate all referenced IDs resolve -> **[G-2]**
- [ ] Task 3.4: Create `scripts/generate-indices.ts` — reads entity frontmatter, groups by dimension values, generates browse index markdown files -> **[G-3]**
- [ ] Task 3.5: Generate browse indices — produce `browse/by-element/*.md`, `browse/by-generation/*.md`, `browse/by-type/*.md`, `browse/by-district/*.md`, `browse/by-canon-tier/*.md` with entity lists and links -> **[G-3]**
- [ ] Task 3.6: Add Vitest snapshot tests — snapshot all generated JSONL/JSON files and browse indices; detect unexpected changes in entity data -> **[G-2, G-6]**

### Dependencies
- Sprint 2: All P0 entity pages with validated frontmatter (Tasks 2.2-2.8)

### Security Considerations
- **Trust boundaries**: Input is locally extracted entity pages (trusted); output is derived data files
- **External dependencies**: No new runtime dependencies; reuses gray-matter, yaml from Sprint 2
- **Sensitive data**: None

### Risks & Mitigation
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cross-reference IDs don't resolve (orphaned links) | Medium | Medium | graph.json generation validates all references; log broken links; fix in entity pages |
| Browse index generation misses dimension values | Low | Low | Test: count index files vs. unique dimension values from frontmatter |

### Success Metrics
- 4 JSONL files + 5 JSON files generated with correct record counts
- `graph.json` has 0 unresolved references
- Browse indices cover 100% of dimension values present in entity frontmatter
- All Vitest snapshot tests pass

---

## Sprint 4: MCP Server & Skills

**Duration:** 2.5 days
**Dates:** 2026-05-23 - 2026-05-25

### Sprint Goal
Implement the stdio-based MCP server with all 9 tools and define the three construct skills with command routing.

### Deliverables
- [ ] Working MCP server (`src/server.ts`) responding to JSON-RPC over stdio
- [ ] 9 MCP tools: lookup_character, lookup_puruhani, lookup_location, lookup_jani, lookup_element, lookup_card, validate_world_element, search, list
- [ ] Three construct skills: `skills/browse-codex/`, `skills/query-entity/`, `skills/cross-reference/`
- [ ] Command routing files in `commands/`
- [ ] Integration tests for all MCP tools
- [ ] Bundled package (`tsup` build) for distribution

### Acceptance Criteria
- [ ] MCP server starts via stdio and responds to `initialize` handshake
- [ ] `lookup_character("Hana")` returns structured JSON with id, name, element, canon_tier, cross_references (per SDD section 5.2)
- [ ] `lookup_puruhani` accepts element parameter and returns matching Puruhani
- [ ] `lookup_location` returns location with district and parent_location
- [ ] `lookup_jani` accepts variant name, slug, or number
- [ ] `lookup_element` returns Wuxing element with full Sheng/Ke cycle relationships and associated entities
- [ ] `validate_world_element` returns CONFIRMED/INCORRECT/UNKNOWN/SPECULATIVE verdict (per SDD section 6.3)
- [ ] `search` returns ranked fuzzy matches via Fuse.js
- [ ] `list` enumerates all entities of a given type
- [ ] Each skill has `index.yaml` and `SKILL.md` conforming to construct skill protocol
- [ ] `pnpm run build` produces single-file bundle via tsup

### Technical Tasks

- [ ] Task 4.1: Implement `src/server.ts` — MCP stdio server using `@modelcontextprotocol/sdk`; register all 9 tools; handle JSON-RPC lifecycle (initialize, tool calls, shutdown) -> **[G-5]**
- [ ] Task 4.2: Implement `src/tools/lookup.ts` — lookup handlers for character, puruhani, location, jani, element, card; reads from `_codex/data/*.jsonl`; returns structured JSON; includes ENTITY_NOT_FOUND error with fuzzy suggestions -> **[G-5]**
- [ ] Task 4.3: Implement `src/tools/validate.ts` — `validate_world_element` anti-hallucination tool; parses claim, looks up entity, compares against canonical data, returns verdict (CONFIRMED/INCORRECT/UNKNOWN/SPECULATIVE) -> **[G-4, G-5]**
- [ ] Task 4.4: Implement `src/tools/search.ts` — Fuse.js fuzzy search across all entity JSONL data; configurable threshold, keys, weights tuned for Purupuru-specific terms -> **[G-5]**
- [ ] Task 4.5: Implement `src/tools/list.ts` — enumerate entities by type from JSONL files -> **[G-5]**
- [ ] Task 4.6: Write skill definitions — `skills/browse-codex/index.yaml` + `SKILL.md`, `skills/query-entity/index.yaml` + `SKILL.md`, `skills/cross-reference/index.yaml` + `SKILL.md` per SDD section 5.3 -> **[G-3]**
- [ ] Task 4.7: Write command routing — create `commands/*.md` files mapping slash commands to skill invocations -> **[G-3]**
- [ ] Task 4.8: Integration tests and build — Vitest integration tests for all 9 MCP tools end-to-end (request -> response over stdio mock); `tsup` build producing single-file bundle -> **[G-5]**

### Dependencies
- Sprint 3: JSONL/JSON exports in `_codex/data/` (Tasks 3.1-3.3), browse indices (Task 3.5)

### Security Considerations
- **Trust boundaries**: MCP server runs locally via stdio; no network exposure; tool inputs are agent-supplied strings (validate input types via Zod)
- **External dependencies**: `@modelcontextprotocol/sdk` 1.x, `fuse.js` 7.1.x, `fast-json-stringify` 6.x — pin exact versions
- **Sensitive data**: None — codex is read-only public lore data

### Risks & Mitigation
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| MCP SDK API changes or incompatibility | Low | High | Pin to specific SDK version; test against MCP spec v1.0 |
| Fuse.js returns poor results for Purupuru-specific terms | Medium | Low | Tune Fuse.js config (threshold: 0.4, keys weighted by entity_type and name); test with real Purupuru queries |
| validate_world_element claim parsing too brittle | Medium | Medium | Start with entity name + field matching; add NLP-style parsing in v2 |

### Success Metrics
- 9/9 MCP tools respond correctly to valid requests
- 9/9 MCP tools return proper error responses for invalid inputs
- `lookup_character("nonexistent")` returns ENTITY_NOT_FOUND with suggestions
- `validate_world_element("Hana's element is Fire")` returns `{ valid: false, verdict: "INCORRECT" }`
- `pnpm run build` produces <500KB bundle

---

## Sprint 5: Validation, Polish & E2E

**Duration:** 2.5 days
**Dates:** 2026-05-26 - 2026-05-28

### Sprint Goal
Complete the three-level CI validation pipeline, harden anti-hallucination, finalize Oracle identity, and validate all PRD goals end-to-end.

### Deliverables
- [ ] `.github/workflows/validate.yml` — three-level CI (L1 schema, L2 integrity, L3 coverage)
- [ ] Cross-reference integrity checker (all entity links resolve)
- [ ] Canon tier consistency validator
- [ ] Finalized `CLAUDE.md` Oracle system prompt
- [ ] Finalized `IDENTITY.md` persona embodiment framework
- [ ] Updated `construct.yaml` with all skills, commands, MCP config fully declared
- [ ] E2E goal validation evidence

### Acceptance Criteria
- [ ] CI L1 (schema): validates every entity page frontmatter against JSON Schema; blocks merge on failure
- [ ] CI L2 (integrity): validates all cross_references resolve to existing entity IDs; validates canon_tier values consistent per source authority; blocks merge on failure
- [ ] CI L3 (coverage): compares entity counts against scope.json targets; warns (advisory) on regression
- [ ] `CLAUDE.md` contains complete Oracle system prompt with Purupuru Oracle persona, voice, constraints (prd.md:L152-174)
- [ ] `construct.yaml` manifest declares all 3 skills, command routes, identity paths, and MCP server entry point
- [ ] All 6 PRD goals validated with documented evidence (see Task 5.E2E)

### Technical Tasks

- [ ] Task 5.1: Implement `.github/workflows/validate.yml` — three-level CI per SDD section 7.3; L1 runs `pnpm run validate:schema`; L2 runs `pnpm run validate:integrity`; L3 runs `pnpm run validate:coverage` -> **[G-6]**
- [ ] Task 5.2: Implement integrity validation — `scripts/validate-integrity.ts` checks: all cross_references resolve, no orphaned browse index entries, canon_tier values valid per four-tier model, source_file references exist -> **[G-6]**
- [ ] Task 5.3: Implement coverage validation — `scripts/validate-coverage.ts` checks: entity counts match scope.json targets, gap tracking delta from previous run, regression detection -> **[G-6]**
- [ ] Task 5.4: Finalize Oracle identity — write `CLAUDE.md` with complete system prompt (Purupuru Oracle: librarian first, oracle second; cites sources; welcomes all knowledge levels; 7-book knowledge system); write `IDENTITY.md` persona embodiment framework -> **[G-3]**
- [ ] Task 5.5: Update `construct.yaml` manifest — ensure all skills, commands, identity paths, and MCP server entry point are declared and accurate -> **[G-3, G-5]**

### Task 5.E2E: End-to-End Goal Validation

**Priority:** P0 (Must Complete)
**Goal Contribution:** All goals (G-1, G-2, G-3, G-4, G-5, G-6)

**Description:**
Validate that all PRD goals are achieved through the complete implementation.

**Validation Steps:**

| Goal ID | Goal | Validation Action | Expected Result |
|---------|------|-------------------|-----------------|
| G-1 | Core entity coverage | Count entity pages: `ls characters/ puruhani/ locations/ jani/` | 5 characters + 5 puruhani + 19+ locations + 13 jani = 42+ pages |
| G-2 | Data format parity | Validate JSONL/JSON exports exist and parse correctly | 4 JSONL files + 5 JSON files, all valid |
| G-3 | Skill coverage | Invoke each skill definition; verify index.yaml + SKILL.md exist | 3 skills with valid construct skill protocol files |
| G-4 | Anti-hallucination | Run `validate_world_element` with known-false claim | Returns `{ valid: false, verdict: "INCORRECT" }` |
| G-5 | MCP integration | Start MCP server; send initialize + tool call via stdio | Server responds with valid MCP responses for all 9 tools |
| G-6 | Canon integrity | Run L1+L2 CI validation; attempt invalid canon_tier | Schema rejects invalid tier; integrity check catches broken cross-references |

**Acceptance Criteria:**
- [ ] Each goal validated with documented evidence
- [ ] Integration points verified (data flows end-to-end: entity page -> JSONL export -> MCP lookup -> structured response)
- [ ] No goal marked as "not achieved" without explicit justification

### Dependencies
- Sprint 4: All MCP tools and skills operational (Tasks 4.1-4.8)

### Security Considerations
- **Trust boundaries**: CI runs in GitHub Actions (trusted runner); no secrets needed for read-only validation
- **External dependencies**: GitHub Actions runners; no new npm dependencies
- **Sensitive data**: None

### Risks & Mitigation
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| CI validation too strict, blocks legitimate content | Low | Medium | L3 (coverage) is advisory-only; L1/L2 strictness tuned against real entity data from Sprint 2 |
| Entity accuracy issues found during E2E validation | Medium | Medium | Budget fix time within sprint; track as bugs for immediate resolution |

### Success Metrics
- CI pipeline passes: L1 (0 schema errors), L2 (0 integrity errors), L3 (0 coverage regressions)
- 6/6 PRD goals validated with evidence
- `construct.yaml` is complete and consistent with actual repository contents
- `CLAUDE.md` system prompt tested by invoking Oracle persona with sample queries

---

## Risk Register

| ID | Risk | Sprint | Probability | Impact | Mitigation | Owner |
|----|------|--------|-------------|--------|------------|-------|
| R1 | world-purupuru content evolves during extraction | 2 | High | Medium | Pin extraction to specific commit hash; re-extract on next cycle | @gumi |
| R2 | Puruhani names blocked by GAP-002 | 2 | High | Medium | Use element-based slugs; update when GAP resolves | @gumi |
| R3 | Character names not finalized | 2 | Medium | High | Confirm with @gumi before extraction; use SDD open questions | @gumi |
| R4 | Mibera-codex patterns don't map cleanly | 1-2 | Medium | Medium | Adapt Purupuru's 6-dimension model; don't force-fit | Sprint Planner |
| R5 | MCP SDK incompatibility | 4 | Low | High | Pin exact SDK version; test against spec | Developer |
| R6 | Fuse.js poor results for Purupuru terms | 4 | Medium | Low | Custom config tuning; test with real queries | Developer |
| R7 | Large source corpus (362+ files) overwhelms extraction | 2 | Medium | Medium | Extract P0 entities only (47 core); defer P1+ to v2 | Developer |

---

## Success Metrics Summary

| Metric | Target | Measurement Method | Sprint |
|--------|--------|-------------------|--------|
| Entity page count | 42+ pages (5+5+19+13) | `find characters/ puruhani/ locations/ jani/ -name "*.md" \| wc -l` | 2 |
| Schema validation pass rate | 100% | `pnpm run validate:schema` exit code 0 | 2-5 |
| JSONL/JSON export count | 9 files | `ls _codex/data/ \| wc -l` | 3 |
| Browse index coverage | 100% dimension values | Compare index file count vs unique frontmatter values | 3 |
| MCP tool response rate | 9/9 tools respond correctly | Integration test suite pass rate | 4 |
| Anti-hallucination accuracy | Known-false claims rejected | validate_world_element integration test | 4-5 |
| CI validation | L1+L2 pass, L3 advisory | GitHub Actions workflow status | 5 |
| PRD goal achievement | 6/6 goals validated | E2E validation task evidence | 5 |

---

## Dependencies Map

```
Sprint 1 ──────────────▶ Sprint 2 ──────────────▶ Sprint 3 ──────────────▶ Sprint 4 ──────────────▶ Sprint 5
   │                        │                        │                        │                        │
   └─ Foundation            └─ Entity Extraction     └─ Exports & Indices    └─ MCP Server & Skills  └─ Validation & E2E
   (schemas, identity,      (47+ entity pages,       (JSONL/JSON exports,    (9 MCP tools, 3 skills,  (3-level CI, Oracle
    TypeScript project,       core lore docs,          graph.json,             command routing,         identity, E2E
    directory structure)      source pinning)          browse indices)         tsup build)              goal validation)
```

---

## Appendix

### A. PRD Feature Mapping

| PRD Feature | Sprint | Status |
|-------------|--------|--------|
| 5.1 Data Layer — Entity Extraction | Sprint 2 | Planned |
| 5.2 Knowledge Organization — Dimensional Model | Sprint 3 | Planned |
| 5.3 Skills (browse, query, cross-reference) | Sprint 4 | Planned |
| 5.4 Anti-Hallucination System | Sprint 4-5 | Planned |
| 5.5 MCP Server (codex-mcp) | Sprint 4 | Planned |
| 5.6 Identity System (Purupuru Oracle) | Sprint 1, 5 | Planned |
| 5.7 Machine-Readable Exports | Sprint 3 | Planned |
| 6.1 Construct Format Compliance | Sprint 1, 5 | Planned |
| 6.2 Canon Integrity | Sprint 2, 5 | Planned |
| 6.3 Performance (deterministic, sub-second) | Sprint 4 | Planned |
| 6.4 Data Integrity (source tracing) | Sprint 2 | Planned |

### B. SDD Component Mapping

| SDD Component | Sprint | Status |
|---------------|--------|--------|
| 1.4 Entity Pages (Data Layer) | Sprint 2 | Planned |
| 1.4 Machine-Readable Exports | Sprint 3 | Planned |
| 1.4 Navigation Indices | Sprint 3 | Planned |
| 1.4 Skill Layer | Sprint 4 | Planned |
| 1.4 MCP Server | Sprint 4 | Planned |
| 1.4 Identity Layer | Sprint 1, 5 | Planned |
| 1.4 Build Pipeline | Sprint 2-3 | Planned |
| 1.4 Validation Layer | Sprint 5 | Planned |
| 3.2 Entity Schema Design | Sprint 1 | Planned |
| 5.2 MCP Tool Definitions | Sprint 4 | Planned |
| 7.3 CI/CD Integration | Sprint 5 | Planned |

### C. PRD Goal Mapping

| Goal ID | Goal Description | Contributing Tasks | Validation Task |
|---------|------------------|-------------------|-----------------|
| G-1 | Core entity coverage (100% of canonical entities) | Sprint 1: Task 1.5; Sprint 2: Tasks 2.2-2.7 | Sprint 5: Task 5.E2E |
| G-2 | Data format parity (JSONL + JSON exports) | Sprint 1: Task 1.5; Sprint 3: Tasks 3.1-3.3, 3.6 | Sprint 5: Task 5.E2E |
| G-3 | Skill coverage (browse, query, cross-reference) | Sprint 1: Tasks 1.1, 1.3; Sprint 3: Tasks 3.4-3.5; Sprint 4: Tasks 4.6-4.7; Sprint 5: Tasks 5.4-5.5 | Sprint 5: Task 5.E2E |
| G-4 | Anti-hallucination (validate rejects fabricated entities) | Sprint 4: Task 4.3 | Sprint 5: Task 5.E2E |
| G-5 | MCP integration (stdio server with 9 tools) | Sprint 1: Tasks 1.1, 1.4; Sprint 4: Tasks 4.1-4.2, 4.4-4.5, 4.8; Sprint 5: Task 5.5 | Sprint 5: Task 5.E2E |
| G-6 | Canon integrity (four-tier model enforced) | Sprint 1: Tasks 1.2, 1.6; Sprint 2: Tasks 2.1, 2.7-2.8; Sprint 3: Task 3.6; Sprint 5: Tasks 5.1-5.3 | Sprint 5: Task 5.E2E |

**Goal Coverage Check:**
- [x] All PRD goals have at least one contributing task
- [x] All goals have a validation task in final sprint (Task 5.E2E)
- [x] No orphan tasks (all tasks annotated with goal contributions)

**Per-Sprint Goal Contribution:**

Sprint 1: G-1 (partial: structure), G-2 (partial: structure), G-3 (partial: scaffold), G-5 (partial: project setup), G-6 (partial: schemas)
Sprint 2: G-1 (complete: all entities extracted), G-6 (partial: validation)
Sprint 3: G-2 (complete: all exports generated), G-3 (partial: browse indices)
Sprint 4: G-3 (complete: all skills), G-4 (complete: validation tool), G-5 (complete: MCP server)
Sprint 5: G-6 (complete: CI pipeline), all goals E2E validated

---

*Generated by Sprint Planner Agent*
