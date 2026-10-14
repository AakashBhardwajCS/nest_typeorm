import * as z from 'zod';

// Zod schemas implement the Standard Schema spec, so Nest can validate with them
// directly via @Body({ schema }) + StandardSchemaValidationPipe.
// `.meta({ id })` makes zod-openapi register the schema as a named component in Swagger.
export const postSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title must contain at least 3 characters.')
      .meta({ description: 'Post title', example: 'Hello NestJS' }),
    content: z
      .string()
      .optional()
      .meta({ description: 'Post body', example: 'Standard Schema with Zod' }),
  })
  .meta({ id: 'PostInput' });

// Shape returned by the API, only used to document responses in Swagger.
export const postResponseSchema = z
  .object({
    id: z.int().meta({ example: 1 }),
    title: z.string(),
    content: z.string().nullable().optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: 'Post' });

// DTOs derived from the schemas: z.input is what the client sends,
// z.output (z.infer) is what the controller receives after validation/transforms.
export type PostInputDto = z.input<typeof postSchema>;
export type PostDto = z.infer<typeof postSchema>;
export type PostResponseDto = z.infer<typeof postResponseSchema>;
