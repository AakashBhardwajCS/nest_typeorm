import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CatBreed } from '../cat.enums.js';
import { PaginationQueryDto } from './pagination-query.dto.js';

// Filters that only make sense for cats.
export class CatFilterQueryDto {
  // Same enumName as in CreateCatDto, so both point at the one shared "CatBreed" schema.
  @ApiPropertyOptional({ enum: CatBreed, enumName: 'CatBreed' })
  @IsOptional()
  @IsEnum(CatBreed)
  breed?: CatBreed;
}

// IntersectionType merges both classes into one: ?breed=&page=&limit=.
// Using a class with @Query() lets Swagger list each property as its own query parameter.
// Defaults like `page = 1` carry over as well.
export class ListCatsQueryDto extends IntersectionType(
  PaginationQueryDto,
  CatFilterQueryDto,
) {}
