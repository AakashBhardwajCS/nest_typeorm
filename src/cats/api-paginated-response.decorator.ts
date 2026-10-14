import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from './dto/paginated.dto.js';

// Documents a response as PaginatedDto<model>, filling in the type of `results`
// that TypeScript generics can't carry to runtime.
export const ApiPaginatedResponse = <TModel extends Type<unknown>>(model: TModel) =>
  applyDecorators(
    // Models only referenced through getSchemaPath() aren't picked up automatically,
    // so register them here or they'd be missing from the "Schemas" section.
    ApiExtraModels(PaginatedDto, model),
    ApiOkResponse({
      schema: {
        // "Everything in PaginatedDto, plus `results` as an array of the given model".
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              results: { type: 'array', items: { $ref: getSchemaPath(model) } },
            },
          },
        ],
      },
    }),
  );
