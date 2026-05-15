import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { globSync } from 'glob';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');

function loadSchema(name: string): object {
  const path = resolve(ROOT, 'schemas', name);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

const ENTITY_DIRS: Record<string, string> = {
  character: 'characters',
  puruhani: 'puruhani',
  location: 'locations',
  jani: 'jani',
};

const ENTITY_SCHEMAS: Record<string, string> = {
  character: 'character.schema.json',
  puruhani: 'puruhani.schema.json',
  location: 'location.schema.json',
  jani: 'jani.schema.json',
};

export interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: string[];
}

export function validateEntities(): ValidationResult[] {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  // Load base schema for ref resolution
  const baseSchema = loadSchema('base-entity.schema.json');
  ajv.addSchema(baseSchema, 'base-entity.schema.json');

  const results: ValidationResult[] = [];

  for (const [entityType, dir] of Object.entries(ENTITY_DIRS)) {
    const schemaFile = ENTITY_SCHEMAS[entityType];
    const schema = loadSchema(schemaFile);
    const validate = ajv.compile(schema);

    const pattern = resolve(ROOT, dir, '*.md');
    const files = globSync(pattern);

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const { data: frontmatter } = matter(content);

      // Skip index/readme files
      const name = basename(file).toLowerCase();
      if (name === 'index.md' || name === 'readme.md') continue;

      const valid = validate(frontmatter);
      results.push({
        file: file.replace(`${ROOT}/`, ''),
        valid: !!valid,
        errors: valid
          ? undefined
          : validate.errors?.map(
              (e) => `${e.instancePath || '/'}: ${e.message}`,
            ),
      });
    }
  }

  return results;
}

// CLI entry point
if (
  process.argv[1]?.endsWith('validate-schema.ts') ||
  process.argv[1]?.endsWith('validate-schema.js')
) {
  const results = validateEntities();
  let hasErrors = false;

  for (const result of results) {
    if (result.valid) {
      console.log(`  PASS  ${result.file}`);
    } else {
      hasErrors = true;
      console.log(`  FAIL  ${result.file}`);
      for (const err of result.errors ?? []) {
        console.log(`        ${err}`);
      }
    }
  }

  if (results.length === 0) {
    console.log('No entity files found to validate.');
  } else {
    const passed = results.filter((r) => r.valid).length;
    console.log(
      `\n${passed}/${results.length} entities passed schema validation.`,
    );
  }

  if (hasErrors) {
    process.exit(1);
  }
}
