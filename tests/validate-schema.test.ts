import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '..');

function loadSchema(name: string): object {
  return JSON.parse(readFileSync(resolve(ROOT, 'schemas', name), 'utf-8'));
}

function createValidator() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  ajv.addSchema(
    loadSchema('base-entity.schema.json'),
    'base-entity.schema.json',
  );
  return ajv;
}

describe('Base Entity Schema', () => {
  it('validates a minimal valid entity', () => {
    const ajv = createValidator();
    const validate = ajv.getSchema(
      'https://purupuru-codex/schemas/base-entity.schema.json',
    )!;
    const valid = validate({
      id: 'char-akane',
      name: 'Akane',
      slug: 'akane',
      entity_type: 'character',
      canon_tier: 'canonical',
    });
    expect(valid).toBe(true);
  });

  it('rejects missing required fields', () => {
    const ajv = createValidator();
    const validate = ajv.getSchema(
      'https://purupuru-codex/schemas/base-entity.schema.json',
    )!;
    const valid = validate({ name: 'Akane' });
    expect(valid).toBe(false);
    expect(validate.errors?.length).toBeGreaterThan(0);
  });

  it('rejects invalid canon_tier', () => {
    const ajv = createValidator();
    const validate = ajv.getSchema(
      'https://purupuru-codex/schemas/base-entity.schema.json',
    )!;
    const valid = validate({
      id: 'char-akane',
      name: 'Akane',
      slug: 'akane',
      entity_type: 'character',
      canon_tier: 'legendary',
    });
    expect(valid).toBe(false);
  });

  it('rejects invalid entity_type', () => {
    const ajv = createValidator();
    const validate = ajv.getSchema(
      'https://purupuru-codex/schemas/base-entity.schema.json',
    )!;
    const valid = validate({
      id: 'char-akane',
      name: 'Akane',
      slug: 'akane',
      entity_type: 'hero',
      canon_tier: 'canonical',
    });
    expect(valid).toBe(false);
  });
});

describe('Character Schema', () => {
  it('validates a full character entity', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('character.schema.json'));
    const valid = validate({
      id: 'char-akane',
      name: 'Akane',
      slug: 'akane',
      entity_type: 'character',
      canon_tier: 'canonical',
      element: 'fire',
      generation: 'kizuna',
      archetype: 'Naughty',
      puruhani_partner: 'puruhani-fire',
      source_file: 'entities/characters/akane.md',
      source_commit: 'abc1234',
      tags: ['kizuna', 'fire', 'character'],
      cross_references: ['puruhani-fire', 'elem-fire'],
    });
    expect(valid).toBe(true);
  });

  it('requires generation field', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('character.schema.json'));
    const valid = validate({
      id: 'char-akane',
      name: 'Akane',
      slug: 'akane',
      entity_type: 'character',
      canon_tier: 'canonical',
    });
    expect(valid).toBe(false);
  });
});

describe('Puruhani Schema', () => {
  it('validates a full puruhani entity', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('puruhani.schema.json'));
    const valid = validate({
      id: 'puruhani-fire',
      name: 'Fire Puruhani',
      slug: 'fire',
      entity_type: 'puruhani',
      canon_tier: 'canonical',
      element: 'fire',
      emotion_trait: 'Nefarious',
      pot_color: 'red',
      bear_type: 'black bear',
      character_partner: 'char-akane',
      source_file: 'entities/puruhani/fire.md',
      tags: ['puruhani', 'fire'],
    });
    expect(valid).toBe(true);
  });

  it('requires emotion_trait, pot_color, bear_type', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('puruhani.schema.json'));
    const valid = validate({
      id: 'puruhani-fire',
      name: 'Fire Puruhani',
      slug: 'fire',
      entity_type: 'puruhani',
      canon_tier: 'canonical',
    });
    expect(valid).toBe(false);
  });
});

describe('Location Schema', () => {
  it('validates a full location entity', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('location.schema.json'));
    const valid = validate({
      id: 'loc-sora-tower',
      name: 'Sora Tower',
      slug: 'sora-tower',
      entity_type: 'location',
      canon_tier: 'canonical',
      district: 'horai-surface',
      parent_location: null,
      element_affinity: null,
      source_file: 'entities/locations/sora-tower.md',
      tags: ['location', 'horai-surface'],
    });
    expect(valid).toBe(true);
  });

  it('requires district field', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('location.schema.json'));
    const valid = validate({
      id: 'loc-sora-tower',
      name: 'Sora Tower',
      slug: 'sora-tower',
      entity_type: 'location',
      canon_tier: 'canonical',
    });
    expect(valid).toBe(false);
  });

  it('rejects invalid district value', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('location.schema.json'));
    const valid = validate({
      id: 'loc-sora-tower',
      name: 'Sora Tower',
      slug: 'sora-tower',
      entity_type: 'location',
      canon_tier: 'canonical',
      district: 'underground',
    });
    expect(valid).toBe(false);
  });
});

describe('Jani Schema', () => {
  it('validates a full jani entity', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('jani.schema.json'));
    const valid = validate({
      id: 'jani-base',
      name: 'Jani',
      slug: 'base',
      entity_type: 'jani',
      canon_tier: 'canonical',
      variant_number: 0,
      is_base: true,
      variant_category: 'base',
      source_file: 'entities/jani/jani.md',
      tags: ['jani'],
    });
    expect(valid).toBe(true);
  });

  it('validates a jani variant', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('jani.schema.json'));
    const valid = validate({
      id: 'jani-wood',
      name: 'Wood Jani',
      slug: 'wood',
      entity_type: 'jani',
      canon_tier: 'canonical',
      element: 'wood',
      variant_number: 1,
      is_base: false,
      variant_category: 'core-wuxing',
      cross_references: ['jani-base', 'elem-wood'],
    });
    expect(valid).toBe(true);
  });

  it('requires variant_number and is_base', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('jani.schema.json'));
    const valid = validate({
      id: 'jani-base',
      name: 'Jani',
      slug: 'base',
      entity_type: 'jani',
      canon_tier: 'canonical',
    });
    expect(valid).toBe(false);
  });
});

describe('Element Schema', () => {
  it('validates a full element entity', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('element.schema.json'));
    const valid = validate({
      id: 'elem-wood',
      name: 'Wood',
      slug: 'wood',
      entity_type: 'element',
      canon_tier: 'canonical',
      element: 'wood',
      sheng_generates: 'elem-fire',
      sheng_generated_by: 'elem-water',
      ke_overcomes: 'elem-earth',
      ke_overcome_by: 'elem-metal',
      characters: ['char-akane'],
      puruhani: ['puruhani-wood'],
      locations: [],
    });
    expect(valid).toBe(true);
  });

  it('requires all cycle relationship fields', () => {
    const ajv = createValidator();
    const validate = ajv.compile(loadSchema('element.schema.json'));
    const valid = validate({
      id: 'elem-wood',
      name: 'Wood',
      slug: 'wood',
      entity_type: 'element',
      canon_tier: 'canonical',
    });
    expect(valid).toBe(false);
  });
});
