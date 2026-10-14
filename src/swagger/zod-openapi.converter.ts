import type { StandardSchemaConverter } from '@nestjs/swagger';
import * as z from 'zod';
import { createSchema } from 'zod-openapi';

// Whenever Swagger runs into a Standard Schema, say from @Body({ schema }) or
// @ApiResponse({ standardSchema }), it hands it to this function and asks for OpenAPI back.
// zod-openapi does the heavy lifting. Any schema with `.meta({ id })` also comes back as a
// named component, so it shows up under "Schemas" and routes just reference it.
export const zodOpenApiConverter: StandardSchemaConverter = (
  schema,
  { schemaType },
) => {
  // zod-openapi only understands Zod. For anything else (Valibot, ArkType, ...) we return
  // undefined and Nest falls back to its own conversion.
  if (!(schema instanceof z.core.$ZodType)) {
    return undefined;
  }

  // mentioned as "as never" couldn't understand this
  return createSchema(schema, {
    // 'input' when it's a request body/param, 'output' when it's a response.
    // This matters for things like .optional(), .default() and transforms.
    io: schemaType,
    // Nest builds an OpenAPI 3.0 document, so ask for 3.0 output
    // (e.g. `nullable: true` instead of 3.1's `type: ['string', 'null']`).
    openapiVersion: '3.0.0',
  });
};
