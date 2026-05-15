# construct-purupuru-codex

Canonical knowledge base for the **Purupuru universe** — a world of honey-rooted magic, sentient Puruhani beings, and the Wuxing elemental cycles that bind them.

Built as a [construct-format](https://github.com/0xHoneyJar/construct-base) codex following the patterns established by [construct-mibera-codex](https://github.com/0xHoneyJar/construct-mibera-codex).

## What's in the codex

| Category | Count | Path |
|----------|-------|------|
| KIZUNA Characters | 5 | `characters/` |
| Puruhani | 5 | `puruhani/` |
| Locations | 19 | `locations/` |
| Jani Variants | 15 | `jani/` |
| Wuxing Elements | 5 | `core-lore/wuxing.yaml` |
| **Total Entities** | **44** | |

### The HENLO System

| Letter | Element | Character | Trait | Puruhani |
|--------|---------|-----------|-------|----------|
| **H** | Wood | Kaori | Hopeful | Happy |
| **E** | Earth | Nemu | Empty | Exhausted |
| **N** | Fire | Akane | Naughty | Nefarious |
| **L** | Metal | Eun | Loyal | Loving |
| **O** | Water | Ruan | Overstimulated | Overwhelmed |

## MCP Server

Query the codex programmatically via [Model Context Protocol](https://modelcontextprotocol.io/).

```bash
# Install
pnpm install

# Build
pnpm run build

# Run
node dist/server.js
```

### 8 Tools

| Tool | Description |
|------|-------------|
| `lookup_character` | Look up a KIZUNA character by name |
| `lookup_puruhani` | Look up a Puruhani by element |
| `lookup_location` | Look up a location by slug |
| `lookup_jani` | Look up a Jani variant |
| `lookup_element` | Wuxing element with Sheng/Ke cycle relationships |
| `validate_world_element` | Anti-hallucination — validate claims against canonical data |
| `search` | Fuzzy search across all entities |
| `list` | List all entities of a given type |

### Add to Claude Desktop

```json
{
  "mcpServers": {
    "purupuru-codex": {
      "command": "node",
      "args": ["/path/to/construct-purupuru-codex/dist/server.js"]
    }
  }
}
```

## Browse

Navigate entities by dimension:

- `browse/by-element/` — Wood, Earth, Fire, Metal, Water
- `browse/by-generation/` — Kizuna
- `browse/by-type/` — Character, Puruhani, Location, Jani
- `browse/by-district/` — Horai Surface, Old Horai, Tsuheji
- `browse/by-canon-tier/` — Canonical, Established, Exploratory, Speculative

## Data Exports

Machine-readable exports in `_codex/data/`:

| File | Format | Content |
|------|--------|---------|
| `characters.jsonl` | JSONL | 5 character records |
| `puruhani.jsonl` | JSONL | 5 puruhani records |
| `locations.jsonl` | JSONL | 19 location records |
| `jani.jsonl` | JSONL | 15 jani records |
| `wuxing.json` | JSON | Element system with Sheng/Ke cycles |
| `graph.json` | JSON | Knowledge graph (44 nodes, 67 edges) |
| `scope.json` | JSON | Entity counts and version |

## Skills

Three construct skills for agent-driven exploration:

- **browse-codex** — Navigate by dimension
- **query-entity** — Deterministic lookup with fuzzy fallback
- **cross-reference** — Traverse entity relationships

## Canon Authority

Content follows a four-tier authority model:

| Tier | Meaning |
|------|---------|
| **Canonical** | Binding truth from lore-bible |
| **Established** | Committed decisions from design cycles |
| **Exploratory** | Validated but not locked |
| **Speculative** | Not yet validated |

Source material: [world-purupuru](https://github.com/project-purupuru/world-purupuru)

## Development

```bash
pnpm install              # Install deps
pnpm test                 # Run tests (16 specs)
pnpm run lint             # Lint
pnpm run build            # Build MCP server
pnpm run validate:schema  # Validate all entity frontmatter
pnpm run generate:exports # Regenerate JSONL/JSON exports
pnpm run generate:indices # Regenerate browse indices
```

## License

MIT
