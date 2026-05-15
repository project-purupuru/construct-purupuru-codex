import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Fuse from 'fuse.js';

const ROOT = resolve(import.meta.dirname, '..');
const DATA = resolve(ROOT, '_codex/data');

export interface Entity {
  id: string;
  name: string;
  slug: string;
  entity_type: string;
  canon_tier: string;
  element?: string | null;
  [key: string]: unknown;
}

function loadJsonl(file: string): Entity[] {
  const content = readFileSync(resolve(DATA, file), 'utf-8').trim();
  if (!content) return [];
  return content.split('\n').map((line) => JSON.parse(line));
}

let _cache: Map<string, Entity[]> | null = null;

function getCache(): Map<string, Entity[]> {
  if (_cache) return _cache;
  _cache = new Map();
  _cache.set('character', loadJsonl('characters.jsonl'));
  _cache.set('puruhani', loadJsonl('puruhani.jsonl'));
  _cache.set('location', loadJsonl('locations.jsonl'));
  _cache.set('jani', loadJsonl('jani.jsonl'));
  return _cache;
}

export function allEntities(): Entity[] {
  const cache = getCache();
  return [...cache.values()].flat();
}

export function entitiesByType(type: string): Entity[] {
  return getCache().get(type) || [];
}

export function findEntity(
  type: string,
  query: string,
): Entity | undefined {
  const entities = entitiesByType(type);
  const q = query.toLowerCase();
  return entities.find(
    (e) =>
      e.id === q ||
      e.slug === q ||
      e.name.toLowerCase() === q ||
      e.id === `${type.slice(0, 4)}-${q}`,
  );
}

let _fuse: Fuse<Entity> | null = null;

export function search(query: string, limit = 10): Entity[] {
  if (!_fuse) {
    _fuse = new Fuse(allEntities(), {
      keys: ['name', 'slug', 'id', 'element', 'archetype', 'emotion_trait'],
      threshold: 0.4,
      includeScore: true,
    });
  }
  return _fuse.search(query, { limit }).map((r) => r.item);
}

export function loadWuxing(): Record<string, unknown> {
  return JSON.parse(readFileSync(resolve(DATA, 'wuxing.json'), 'utf-8'));
}
