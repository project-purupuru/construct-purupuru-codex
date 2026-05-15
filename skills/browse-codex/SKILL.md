# Browse Codex

Navigate Purupuru entities across 6 dimensions: element, generation, type, district, canon-tier, rarity.

## Trigger

"Browse by element", "Show all fire entities", "List locations by district"

## Workflow

1. User selects dimension (element/generation/type/district/canon-tier/rarity)
2. Read corresponding `browse/by-{dimension}/{value}.md`
3. Present entity list with links

## Boundaries

- Read-only — never modifies entity data
- Only surfaces entities present in browse indices
