import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { CatBreed, CatTrait } from '../cat.enums.js';

// Swagger can't see TypeScript types at runtime, so every property needs @ApiProperty
// to show up in the docs. The class-validator decorators are still needed on top:
// the global ValidationPipe runs with `whitelist: true` and strips anything without one.
//
// @ApiSchema renames the model in the docs; without it the schema would be called "CreateCatDto".
@ApiSchema({ name: 'CreateCatRequest', description: 'What you send to add a cat' })
export class CreateCatDto {
  // A single `example` is what Swagger UI pre-fills in "Try it out".
  @ApiProperty({ description: 'What the cat answers to (sometimes)', example: 'Whiskers', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Age in years', minimum: 0, maximum: 30, default: 1, example: 3 })
  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  // Passing the enum lists every allowed value. `enumName` pulls it out into its own
  // "CatBreed" schema, so it's defined once and reused instead of copied into every model
  @ApiProperty({ enum: CatBreed, enumName: 'CatBreed', example: CatBreed.Bengal })
  @IsEnum(CatBreed)
  breed: CatBreed;

  // enum + isArray: an array of enum values. Swagger UI renders this as a multi-select.
  @ApiPropertyOptional({
    enum: CatTrait,
    enumName: 'CatTrait',
    isArray: true,
    example: [CatTrait.Curious, CatTrait.Vocal],
  })
  @IsOptional()
  @IsEnum(CatTrait, { each: true })
  traits?: CatTrait[];

  // Arrays of primitives: put the item type in brackets.
  // `isArray: true` with `type: String` would do the same thing.
  @ApiPropertyOptional({ type: [String], example: ['Whisk', 'Sir Fluff'] })
  @IsOptional()
  @IsString({ each: true })
  nicknames?: string[];

  // `examples` gives several named samples to pick from instead of one.
  @ApiPropertyOptional({
    description: 'A few words about the cat',
    examples: {
      short: { summary: 'Short bio', value: 'Sleeps a lot.' },
      long: {
        summary: 'Long bio',
        value: 'Rescued in 2024, loves cardboard boxes and knocking things off tables.',
      },
    },
  })
  @IsOptional()
  @IsString()
  bio?: string;

  // Nested arrays can't be expressed with `type: [[Number]]`, so this one is a raw
  // definition: an array of arrays of numbers (one row of weigh-ins per week).
  @ApiPropertyOptional({
    description: 'Weekly weigh-ins in kg, one array per week',
    type: 'array',
    items: { type: 'array', items: { type: 'number' } },
    example: [[4.1, 4.2], [4.3]],
  })
  @IsOptional()
  @IsArray()
  weighIns?: number[][];
}
