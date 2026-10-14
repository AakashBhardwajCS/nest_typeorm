import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { CreateCatDto } from './create-cat.dto.js';

// What the API sends back. It inherits every documented property from CreateCatDto.
// The explicit @ApiSchema matters: otherwise it would inherit the "CreateCatRequest" name too.
@ApiSchema({ name: 'Cat' })
export class CatDto extends CreateCatDto {
  @ApiProperty({ example: 1 })
  id: number;
}
