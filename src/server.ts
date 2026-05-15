import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  allEntities,
  entitiesByType,
  findEntity,
  loadWuxing,
  search,
} from './data.js';

const server = new Server(
  { name: 'purupuru-codex', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

const ENTITY_TYPES = [
  'character',
  'puruhani',
  'location',
  'jani',
  'element',
  'card',
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'lookup_character',
      description: 'Look up a KIZUNA character by name or slug',
      inputSchema: {
        type: 'object' as const,
        required: ['name'],
        properties: { name: { type: 'string' } },
      },
    },
    {
      name: 'lookup_puruhani',
      description: 'Look up a Puruhani by element or name',
      inputSchema: {
        type: 'object' as const,
        properties: {
          element: {
            type: 'string',
            enum: ['wood', 'earth', 'fire', 'metal', 'water'],
          },
          name: { type: 'string' },
        },
      },
    },
    {
      name: 'lookup_location',
      description: 'Look up a location by slug or name',
      inputSchema: {
        type: 'object' as const,
        required: ['slug'],
        properties: { slug: { type: 'string' } },
      },
    },
    {
      name: 'lookup_jani',
      description: 'Look up a Jani variant by name, slug, or variant number',
      inputSchema: {
        type: 'object' as const,
        required: ['variant'],
        properties: { variant: { type: 'string' } },
      },
    },
    {
      name: 'lookup_element',
      description: 'Look up a Wuxing element and its cycle relationships',
      inputSchema: {
        type: 'object' as const,
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            enum: ['wood', 'earth', 'fire', 'metal', 'water'],
          },
        },
      },
    },
    {
      name: 'lookup_card',
      description: 'Look up a card by ID (v2 — no card data in v1)',
      inputSchema: {
        type: 'object' as const,
        required: ['id'],
        properties: { id: { type: 'string' } },
      },
    },
    {
      name: 'validate_world_element',
      description:
        'Validate a claim about the Purupuru world against canonical data',
      inputSchema: {
        type: 'object' as const,
        required: ['claim'],
        properties: {
          claim: { type: 'string' },
          entity_type: { type: 'string', enum: ENTITY_TYPES },
        },
      },
    },
    {
      name: 'search',
      description: 'Fuzzy search across all codex entities',
      inputSchema: {
        type: 'object' as const,
        required: ['query'],
        properties: {
          query: { type: 'string' },
          limit: { type: 'number' },
        },
      },
    },
    {
      name: 'list',
      description: 'List all entities of a given type',
      inputSchema: {
        type: 'object' as const,
        required: ['entity_type'],
        properties: { entity_type: { type: 'string', enum: ENTITY_TYPES } },
      },
    },
  ],
}));

function suggest(query: string): string[] {
  return search(query, 3).map((e) => e.name);
}

function notFound(type: string, query: string) {
  const suggestions = suggest(query);
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          error: 'ENTITY_NOT_FOUND',
          message: `No ${type} found matching '${query}'`,
          suggestions,
        }),
      },
    ],
  };
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'lookup_character': {
      const q = (args as Record<string, string>).name;
      const entity = findEntity('character', q);
      if (!entity) return notFound('character', q);
      return { content: [{ type: 'text', text: JSON.stringify(entity) }] };
    }

    case 'lookup_puruhani': {
      const a = args as Record<string, string>;
      const q = a.element || a.name || '';
      const entity = findEntity('puruhani', q);
      if (!entity) return notFound('puruhani', q);
      return { content: [{ type: 'text', text: JSON.stringify(entity) }] };
    }

    case 'lookup_location': {
      const q = (args as Record<string, string>).slug;
      const entity = findEntity('location', q);
      if (!entity) return notFound('location', q);
      return { content: [{ type: 'text', text: JSON.stringify(entity) }] };
    }

    case 'lookup_jani': {
      const q = (args as Record<string, string>).variant;
      const entity = findEntity('jani', q);
      if (!entity) return notFound('jani', q);
      return { content: [{ type: 'text', text: JSON.stringify(entity) }] };
    }

    case 'lookup_element': {
      const q = (args as Record<string, string>).name;
      const wuxing = loadWuxing() as { elements: Record<string, unknown> };
      const elem = wuxing.elements?.[q];
      if (!elem) return notFound('element', q);
      return { content: [{ type: 'text', text: JSON.stringify(elem) }] };
    }

    case 'lookup_card': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'NOT_AVAILABLE',
              message:
                'Card data not available in v1. Cards will be populated in v2.',
            }),
          },
        ],
      };
    }

    case 'validate_world_element': {
      const a = args as Record<string, string>;
      const claim = a.claim.toLowerCase();

      // Extract entity name and field from claim
      const all = allEntities();
      let matched = false;

      for (const e of all) {
        if (!claim.includes(e.name.toLowerCase())) continue;
        matched = true;

        // Check element claims
        const elemMatch = claim.match(/element\s+is\s+(\w+)/i);
        if (elemMatch) {
          const claimed = elemMatch[1].toLowerCase();
          const actual = (e.element as string)?.toLowerCase();
          if (actual && claimed !== actual) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    valid: false,
                    verdict: 'INCORRECT',
                    claim: a.claim,
                    canonical_value: `${e.name}'s element is ${actual}`,
                    source: e.source_file,
                    canon_tier: e.canon_tier,
                  }),
                },
              ],
            };
          }
          if (actual && claimed === actual) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    valid: true,
                    verdict: 'CONFIRMED',
                    claim: a.claim,
                    source: e.source_file,
                    canon_tier: e.canon_tier,
                  }),
                },
              ],
            };
          }
        }

        // If entity found but claim field not recognized
        if (e.canon_tier === 'speculative') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  valid: false,
                  verdict: 'SPECULATIVE',
                  claim: a.claim,
                  message: `${e.name} exists but is speculative tier`,
                  canon_tier: e.canon_tier,
                }),
              },
            ],
          };
        }
      }

      if (!matched) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                valid: false,
                verdict: 'UNKNOWN',
                claim: a.claim,
                message: 'Entity not found in codex',
              }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              valid: true,
              verdict: 'CONFIRMED',
              claim: a.claim,
              message: 'Entity exists in codex',
            }),
          },
        ],
      };
    }

    case 'search': {
      const a = args as Record<string, unknown>;
      const results = search(a.query as string, (a.limit as number) || 10);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              results.map((e) => ({
                id: e.id,
                name: e.name,
                type: e.entity_type,
              })),
            ),
          },
        ],
      };
    }

    case 'list': {
      const a = args as Record<string, string>;
      const entities = entitiesByType(a.entity_type);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              entities.map((e) => ({ id: e.id, name: e.name })),
            ),
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: 'UNKNOWN_TOOL', name }),
          },
        ],
      };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
