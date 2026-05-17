import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');
const DATA_DIR = resolve(ROOT, '_codex/data');

mkdirSync(DATA_DIR, { recursive: true });

type EntityDir = { dir: string; output: string };

const ENTITY_DIRS: EntityDir[] = [
  { dir: 'characters/caretakers', output: 'characters.jsonl' },
  { dir: 'puruhani', output: 'puruhani.jsonl' },
  { dir: 'locations', output: 'locations.jsonl' },
  { dir: 'characters/jani', output: 'jani.jsonl' },
  { dir: 'cards', output: 'cards.jsonl' },
];

// Generate JSONL exports
for (const { dir, output } of ENTITY_DIRS) {
  const files = globSync(resolve(ROOT, dir, '*.md'));
  const lines: string[] = [];

  for (const file of files) {
    const name = basename(file).toLowerCase();
    if (name === 'index.md' || name === 'readme.md') continue;

    const content = readFileSync(file, 'utf-8');
    const { data } = matter(content);
    lines.push(JSON.stringify(data));
  }

  writeFileSync(resolve(DATA_DIR, output), lines.join('\n') + '\n');
  console.log(`  ${output}: ${lines.length} records`);
}

// Generate wuxing.json from wuxing.yaml
const wuxingPath = resolve(ROOT, 'core-lore/wuxing.yaml');
const wuxingData = parseYaml(readFileSync(wuxingPath, 'utf-8'));
writeFileSync(
  resolve(DATA_DIR, 'wuxing.json'),
  JSON.stringify(wuxingData, null, 2),
);
console.log('  wuxing.json: generated');

// Generate scope.json
const scope = {
  version: '0.1.0',
  generated_at: new Date().toISOString(),
  entity_counts: {} as Record<string, number>,
};
for (const { dir, output } of ENTITY_DIRS) {
  const files = globSync(resolve(ROOT, dir, '*.md')).filter(
    (f) =>
      !basename(f)
        .toLowerCase()
        .match(/^(index|readme)\.md$/),
  );
  scope.entity_counts[dir] = files.length;
}
writeFileSync(resolve(DATA_DIR, 'scope.json'), JSON.stringify(scope, null, 2));
console.log('  scope.json: generated');

// Generate graph.json (knowledge graph from cross_references)
interface GraphNode {
  id: string;
  entity_type: string;
  name: string;
}
interface GraphEdge {
  source: string;
  target: string;
}

const nodes: GraphNode[] = [];
const edges: GraphEdge[] = [];

for (const { dir } of ENTITY_DIRS) {
  const files = globSync(resolve(ROOT, dir, '*.md'));
  for (const file of files) {
    const name = basename(file).toLowerCase();
    if (name === 'index.md' || name === 'readme.md') continue;

    const { data } = matter(readFileSync(file, 'utf-8'));
    const d = data as Record<string, unknown>;
    if (d.id && d.entity_type && d.name) {
      nodes.push({
        id: d.id as string,
        entity_type: d.entity_type as string,
        name: d.name as string,
      });
      const refs = (d.cross_references as string[]) || [];
      for (const ref of refs) {
        edges.push({ source: d.id as string, target: ref });
      }
    }
  }
}

// Add element nodes from wuxing.yaml
const wuxingElements = wuxingData as { elements: Record<string, { id: string; name: string }> };
for (const [, elem] of Object.entries(wuxingElements.elements || {})) {
  if (elem.id && elem.name) {
    nodes.push({ id: elem.id, entity_type: 'element', name: elem.name });
  }
}

// Remove edges that still don't resolve
const nodeIds = new Set(nodes.map((n) => n.id));
const validEdges = edges.filter((e) => nodeIds.has(e.target));
const dropped = edges.length - validEdges.length;

writeFileSync(
  resolve(DATA_DIR, 'graph.json'),
  JSON.stringify({ nodes, edges: validEdges }, null, 2),
);
console.log(`  graph.json: ${nodes.length} nodes, ${validEdges.length} edges${dropped ? ` (${dropped} unresolvable dropped)` : ''}`);

console.log('\nExport generation complete.');
