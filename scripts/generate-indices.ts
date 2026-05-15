import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { globSync } from 'glob';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const BROWSE = resolve(ROOT, 'browse');

interface Entity {
  id: string;
  name: string;
  entity_type: string;
  element?: string | null;
  generation?: string;
  district?: string;
  canon_tier: string;
}

// Collect all entities
const entities: Entity[] = [];
const dirs = ['characters', 'puruhani', 'locations', 'jani'];

for (const dir of dirs) {
  const files = globSync(resolve(ROOT, dir, '*.md'));
  for (const file of files) {
    const name = basename(file).toLowerCase();
    if (name === 'index.md' || name === 'readme.md') continue;
    const { data } = matter(readFileSync(file, 'utf-8'));
    entities.push(data as Entity);
  }
}

// Dimension generators
type DimFn = (e: Entity) => string | null;

const dimensions: Record<string, DimFn> = {
  'by-element': (e) => e.element || null,
  'by-generation': (e) => e.generation || null,
  'by-type': (e) => e.entity_type,
  'by-district': (e) =>
    ((e as Record<string, unknown>).district as string) || null,
  'by-canon-tier': (e) => e.canon_tier,
};

for (const [dimDir, dimFn] of Object.entries(dimensions)) {
  const dir = resolve(BROWSE, dimDir);
  mkdirSync(dir, { recursive: true });

  // Group entities by dimension value
  const groups = new Map<string, Entity[]>();
  for (const e of entities) {
    const val = dimFn(e);
    if (!val) continue;
    if (!groups.has(val)) groups.set(val, []);
    groups.get(val)!.push(e);
  }

  // Write index per value
  for (const [val, ents] of groups) {
    const lines = [`# ${val.charAt(0).toUpperCase() + val.slice(1)}`, ''];
    lines.push(
      `${ents.length} entities with ${dimDir.replace('by-', '')} = **${val}**`,
      '',
    );
    lines.push('| Entity | Type | ID |');
    lines.push('|--------|------|----|');
    for (const e of ents.sort((a, b) => a.name.localeCompare(b.name))) {
      const relPath = `../../${e.entity_type === 'jani' ? 'jani' : e.entity_type === 'character' ? 'characters' : e.entity_type === 'puruhani' ? 'puruhani' : 'locations'}/${e.id.split('-').slice(1).join('-')}.md`;
      lines.push(
        `| [${e.name}](${relPath}) | ${e.entity_type} | \`${e.id}\` |`,
      );
    }
    writeFileSync(resolve(dir, `${val}.md`), lines.join('\n') + '\n');
  }

  console.log(`  ${dimDir}: ${groups.size} index files`);
}

console.log('\nIndex generation complete.');
