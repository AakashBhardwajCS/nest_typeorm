import { ApiSchema, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCatDto } from './create-cat.dto.js';

// Composition: start from CreateCatDto, drop `name` (it has its own endpoint, see RenameCatDto),
// then make everything that's left optional, which suits a PATCH.
//
// Import these helpers from @nestjs/swagger, not @nestjs/mapped-types: the swagger versions
// also carry over the @ApiProperty docs. Either way the class-validator rules come along too,
// and PartialType adds @IsOptional() to every property.
@ApiSchema({ name: 'UpdateCatRequest' })
export class UpdateCatDto extends PartialType(
  OmitType(CreateCatDto, ['name'] as const),
) {}
