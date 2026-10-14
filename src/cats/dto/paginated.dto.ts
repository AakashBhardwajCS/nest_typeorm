import { ApiProperty } from '@nestjs/swagger';

// A generic wrapper for any paginated list.
// Generics disappear once TypeScript is compiled, so Swagger has no way to know what
// `results` holds here. That's why `results` has no @ApiProperty: the
// @ApiPaginatedResponse() decorator fills it in for each endpoint.
export class PaginatedDto<TData> {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  results: TData[];
}
