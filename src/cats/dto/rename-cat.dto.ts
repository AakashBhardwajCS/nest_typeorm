import { ApiSchema, PickType } from '@nestjs/swagger';
import { CreateCatDto } from './create-cat.dto.js';

// PickType keeps only the listed properties, docs and validation included.
// `as const` keeps the key as the literal 'name' so TypeScript knows exactly what's picked.
@ApiSchema({ name: 'RenameCatRequest' })
export class RenameCatDto extends PickType(CreateCatDto, ['name'] as const) {}
